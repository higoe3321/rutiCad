console.log("ROUTES CARREGADAS");

const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("./db");

//login
router.post("/login", (req, res) => {
  const { user, pass } = req.body;

  const sql = "SELECT * FROM acessos WHERE USUARIO = ?";

  db.query(sql, [user], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro ao consultar usuário" });
    }

    // Usuário não existe
    if (results.length === 0) {
      return res
        .status(401)
        .json({ mensagem: "Usuário ou senha inválidos", sucesso: false });
    }
    const usuario = results[0];
    // Verificar senha
    const senhaCorreta = await bcrypt.compare(pass, usuario.SENHA);

    if (!senhaCorreta) {
      return res
        .status(401)
        .json({ mensagem: "Usuário ou senha inválidos", sucesso: false });
    }

    const token = jwt.sign(
      {
        id: usuario.ID,
        nivel: usuario.NIVEL,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      mensagem: "Login bem-sucedido!",
      sucesso: true,
      token,
    });
  });
});

//novo acesso
router.post("/novoAcesso", async (req, res) => {
  const { usuario, senha, nivel } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const sql = "INSERT INTO acessos (USUARIO, SENHA, NIVEL) VALUES (?, ?, ?)";

    db.query(sql, [usuario, senhaHash, nivel], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensagem: "Erro ao criar novo acesso" });
      }
      res.json({ mensagem: "Novo acesso criado com sucesso!" });
    });
  } catch (err) {
    console.error("Erro ao criar novo acesso:", err);
    res.status(500).json({ mensagem: "Erro ao criar novo acesso" });
  }
});

//pegar dados do banco para email
router.get("/pegar-email/:id", (req, res) => {
  sql =
    'SELECT EMAIL, SUBSTRING_INDEX(NOME, " ", 1) AS PRIMEIRO_NOME FROM cadgeral WHERE ID = ?';

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro ao buscar lista" });
    }
    res.json(results);
  });
});

//enviar email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const { enviarEmail } = require("./gmailService");

router.post("/enviar-email", async (req, res) => {
  const { email, assunto, mensagem } = req.body;

  try {
    await enviarEmail({
      to: email,
      subject: assunto,
      text: mensagem,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ ok: false });
  }
});

// cadastro geral
router.post("/cadastro-geral", (req, res) => {
  const {
    nome,
    email,
    telefone,
    tipoDocumento,
    documento,
    data,
    profissao,
    cep,
    estado,
    cidade,
    bairro,
    rua,
    numero,
    complemento,
    descricao,
  } = req.body;

  // 1️⃣ começa a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao iniciar transaction" });
    }

    // 2️⃣ cria a pessoa base
    const sqlPessoa = `
      INSERT INTO pessoa (tipo)
      VALUES ('FISICA')
    `;

    db.query(sqlPessoa, (err, resultPessoa) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ erro: "Erro ao criar pessoa" });
        });
      }

      const pessoaId = resultPessoa.insertId;

      // 3️⃣ cria o cadastro geral usando o MESMO ID
      const sqlCadGeral = `
        INSERT INTO cadgeral
        (PESSOA_ID, NOME, EMAIL, TELEFONE, TIPOID, DOCUMENTO, DATANASC, PROFISSAO,
         CEP, ESTADO, CIDADE, BAIRRO, RUA, NUMEROCASA, COMPLEMENTO, DESCRICAO)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valores = [
        pessoaId,
        nome,
        email,
        telefone,
        tipoDocumento,
        documento,
        data,
        profissao,
        cep,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        complemento,
        descricao,
      ];

      db.query(sqlCadGeral, valores, (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ erro: "Erro ao criar cadastro geral" });
          });
        }

        // 4️⃣ confirma tudo
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ erro: "Erro ao finalizar transaction" });
            });
          }

          res.json({ mensagem: "Cadastro geral salvo com sucesso!" });
        });
      });
    });
  });
});

//pegar informações do banco

//cadastro geral
router.get("/cadastro-geral/lista", (req, res) => {
  const sql = "SELECT ID, NOME, EMAIL FROM cadgeral ORDER BY NOME ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro ao buscar lista" });
    }

    res.json(results);
  });
});

//ver detalhes

//detalhes cadastro geral
router.get("/cadastro-geral/:id", (req, res) => {
  const sql = "SELECT * FROM cadgeral WHERE ID = ?";

  db.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ mensagem: "Cadastro não encontrado" });
    }

    res.json(results[0]);
  });
});

//nova Visita

router.post("/novaVisita", (req, res) => {
  const { pessoaId, data, assunto, descricao } = req.body;

  const sql = `
    INSERT INTO visitas
    (pessoa_id, DATA, ASSUNTO, DESCRICAO)
    VALUES (?, ?, ?, ?)
  `;

  const valores = [pessoaId, data, assunto, descricao];
  db.query(sql, valores, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro ao salvar no banco" });
    }

    res.json({ mensagem: "Visita salva com sucesso!" + pessoaId });
  });
});

//relatorio de visitas
router.get("/relatorio/lista", (req, res) => {
  const sql = `
    SELECT 
      ID, 
      DATE_FORMAT(v.DATA, '%d/%m/%Y') AS DATA, 
      ASSUNTO 
    FROM visitas v
    ORDER BY v.DATA DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro ao buscar lista" });
    }

    res.json(results);
  });
});

// detalhes relatorio
router.get("/relatorio/:id", (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(v.DATA, '%d/%m/%Y') AS DATA,
      v.ASSUNTO,
      v.DESCRICAO,
      c.NOME
    FROM visitas v
    JOIN cadgeral c ON c.PESSOA_ID = v.pessoa_id
    WHERE v.ID = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(404).json({ mensagem: "Cadastro não encontrado" });
    }

    const visita = results[0];

    res.json({
      DATA: visita.DATA,
      ASSUNTO: visita.ASSUNTO,
      DESCRICAO: visita.DESCRICAO,
      NOME: visita.NOME,
    });
  });
});

// detalhes relatorio para o detalhe do cadastro geral
router.get("/relatorioCad/:id", (req, res) => {
  const pessoaId = req.params.id;

  const sql = `
  SELECT 
    DATE_FORMAT(v.DATA, '%d/%m/%Y') AS DATA,
    v.ID,
    v.ASSUNTO,
    v.DESCRICAO,
    c.NOME
  FROM visitas v
  JOIN cadgeral c ON c.PESSOA_ID = v.pessoa_id
  WHERE v.pessoa_id = ?
`;

  db.query(sql, [pessoaId], (err, visitas) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: "Erro no servidor" });
    }

    // SEM visitas → array vazio
    res.json(visitas);
  });
});

// editar

//editar cadastro geral
router.post("/editCadGeral", (req, res) => {
  const {
    id,
    nome,
    email,
    telefone,
    tipoDocumento,
    documento,
    data,
    profissao,
    cep,
    estado,
    cidade,
    bairro,
    rua,
    numero,
    complemento,
    descricao,
  } = req.body;

  const sql = `
      UPDATE cadgeral
      SET NOME = ?, EMAIL = ?, TELEFONE = ?, TIPOID = ?, DOCUMENTO = ?, DATANASC = ?, PROFISSAO = ?,
          CEP = ?, ESTADO = ?, CIDADE = ?, BAIRRO = ?, RUA = ?, NUMEROCASA = ?, COMPLEMENTO = ?, DESCRICAO = ?
      WHERE ID = ?
  `;

  const valores = [
    nome,
    email,
    telefone,
    tipoDocumento,
    documento,
    data,
    profissao,
    cep,
    estado,
    cidade,
    bairro,
    rua,
    numero,
    complemento,
    descricao,
    id,
  ];

  db.query(sql, valores, (err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao atualizar cadastro geral" });
    }

    res.json({ mensagem: "Cadastro geral atualizado com sucesso!" });
  });
});

//deletar cadastro geral
router.delete("/cadastro-geral/:id", (req, res) => {
  const cadGeralId = req.params.id;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao iniciar transaction" });
    }

    // 1️⃣ descobrir o PESSOA_ID
    const sqlBusca = "SELECT PESSOA_ID FROM cadgeral WHERE ID = ?";
    db.query(sqlBusca, [cadGeralId], (err, rows) => {
      if (err || rows.length === 0) {
        return db.rollback(() =>
          res.status(404).json({ erro: "Cadastro não encontrado" })
        );
      }

      const pessoaId = rows[0].PESSOA_ID;

      // 2️⃣ apaga visitas
      db.query("DELETE FROM visitas WHERE pessoa_id = ?", [pessoaId], (err) => {
        if (err) {
          return db.rollback(() =>
            res.status(500).json({ erro: "Erro ao excluir visitas" })
          );
        }

        // 3️⃣ apaga cadgeral
        db.query("DELETE FROM cadgeral WHERE ID = ?", [cadGeralId], (err) => {
          if (err) {
            return db.rollback(() =>
              res.status(500).json({ erro: "Erro ao excluir cadastro geral" })
            );
          }

          // 4️⃣ apaga pessoa
          db.query("DELETE FROM pessoa WHERE id = ?", [pessoaId], (err) => {
            if (err) {
              return db.rollback(() =>
                res.status(500).json({ erro: "Erro ao excluir pessoa" })
              );
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() =>
                  res.status(500).json({ erro: "Erro ao finalizar transaction" })
                );
              }

              res.json({ mensagem: "Cadastro excluído com sucesso" });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
