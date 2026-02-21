const form = document.getElementById("login");

addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Enviando formulário");

    const dados = {
        user: document.getElementById("user").value,
        pass: document.getElementById("pass").value,
    };

    const resposta = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
    });
        const resultado = await resposta.json();
        alert(resultado.mensagem);

        if (resultado.sucesso) {
            window.location.href = "/frontend/index.html";
        } else {
            document.getElementById("login").reset();
        }

        document.getElementById("login").reset();
    });




