const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ruticad"
});

conexao.connect((err) => {
    if (err) {
        console.error("erro ao conectar no MySQL:", err);
    } else {
        console.log("MySQL conectado com sucesso!");
    }
});

module.exports = conexao;