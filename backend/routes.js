console.log("ROUTES CARREGADAS");

const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const db = require("./db");

//pegar dados do banco para email
router.get("/pegar-email/:id", (req, res) => {
  sql = 'SELECT EMAIL, SUBSTRING_INDEX(NOME, " ", 1) AS PRIMEIRO_NOME FROM cadgeral WHERE ID = ?' 
  
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
  }
});

router.post("/enviar-email", (req, res) => {
  
  const email = req.body.email;
  const assunto = req.body.assunto;
  const mensagem = req.body.mensagem;

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: assunto,
    text: mensagem
  });

  res.json({ ok: true });
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
      VALUES ('geral')
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
  const sql = "SELECT ID, DATA, ASSUNTO FROM visitas ORDER BY DATA DESC";

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
  const sql1 =
    "SELECT DATA, ASSUNTO, DESCRICAO, pessoa_id FROM visitas WHERE ID = ?";

  db.query(sql1, [req.params.id], (err, visitas) => {
    if (err || visitas.length === 0) {
      return res.status(404).json({ mensagem: "Cadastro não encontrado" });
    }

    const visita = visitas[0];
    const pessoaId = visita.pessoa_id;

    // 2️⃣ buscar nome independente da tabela
    const sql2 = `
      SELECT NOME FROM cadgeral WHERE PESSOA_ID = ?
    `;

    db.query(sql2, [pessoaId], (err2, pessoa) => {
      if (err2 || pessoa.length === 0) {
        return res.status(404).json({ mensagem: "Pessoa não encontrada" });
      }

      res.json({
        DATA: visita.DATA,
        ASSUNTO: visita.ASSUNTO,
        DESCRICAO: visita.DESCRICAO,
        NOME: pessoa[0].NOME,
      });
    });
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

module.exports = router;
