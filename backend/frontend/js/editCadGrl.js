if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


document
  .getElementById("formEditCadGeral")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔹 PEGA O ID DA URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const dados = {
      id,
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("tel").value,
      tipoDocumento: document.getElementById("tipoDocumento").value,
      documento: document.getElementById("documento").value,
      data: document.getElementById("data").value,
      profissao: document.getElementById("profissao").value,
      cep: document.getElementById("cep").value,
      estado: document.getElementById("estado").value,
      cidade: document.getElementById("cidade").value,
      bairro: document.getElementById("bairro").value,
      rua: document.getElementById("rua").value,
      numero: document.getElementById("numero").value,
      complemento: document.getElementById("comp").value,
      descricao: document.getElementById("descricao").value,
    };

    const resposta = await fetch("/api/editCadGeral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);
  });
