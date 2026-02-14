function criar(usuario, senhaHash, nivel) {
  return db.query(
    "INSERT INTO usuarios (usuario, senha, nivel) VALUES (?, ?, ?)",
    [usuario, senhaHash, nivel]
  );
}
