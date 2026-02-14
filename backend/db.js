const mysql = require("mysql2");

const conexao = mysql.createConnection(process.env.MYSQL_URL);

conexao.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
  } else {
    console.log("MySQL conectado com sucesso!");
  }
});

module.exports = conexao;
