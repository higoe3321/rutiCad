require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor OK");
});

const path = require("path");

app.use("/frontend", express.static(path.join(__dirname, "../frontend")));


// rotas
const routes = require("./routes.js");
app.use("/api", routes);

// servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
