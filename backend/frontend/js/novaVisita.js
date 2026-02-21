if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


document
  .getElementById("formNovaVisita")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const pessoaId = document.getElementById("pessoaIdInput").value;
    const data = document.getElementById("data").value;
    const assunto = document.getElementById("assunto").value;
    const descricao = document.getElementById("descricao").value;

    const resposta = await fetch("/api/novaVisita", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pessoaId, data, assunto, descricao }),
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);

    formNovaVisita.reset();
  });
