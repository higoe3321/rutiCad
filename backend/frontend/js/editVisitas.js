if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }

document
  .getElementById("formEditVisita")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔹 PEGA O ID DA URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const dados = {
      id,
      descricao: document.getElementById("descricao").value,
    };

    const resposta = await fetch("/api/editVisita", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);
  });
