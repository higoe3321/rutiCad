if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


document
  .getElementById("formAcessos")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    const nivel = document.getElementById("nivel").value;

    fetch("/api/novoAcesso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario: usuario,
        senha: senha,
        nivel: nivel,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  });
