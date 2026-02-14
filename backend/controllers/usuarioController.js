const bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuarioModel");

async function criar(req, res) {
  const { usuario, senha, nivel } = req.body;

  const senhaHash = await bcrypt.hash(senha, 10);
  await usuarioModel.criar(usuario, senhaHash, nivel);

  res.status(201).json({ ok: true });
}

module.exports = { criar };