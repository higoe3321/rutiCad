document.getElementById("formNovoCargo").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cargo = document.getElementById("cargo").value;
    const descricao = document.getElementById("descricao").value;

    const resposta = await fetch("/api/novoCargo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cargo, descricao})
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);

    formNovoCargo.reset();
});