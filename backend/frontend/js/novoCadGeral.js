document.getElementById("formCadGeral").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("tel").value;
    const tipoDocumento = document.getElementById("tipoDocumento").value;
    const documento = document.getElementById("documento").value;
    const data = document.getElementById("data").value;
    const profissao = document.getElementById("profissao").value;

    const cep = document.getElementById("cep").value;
    const estado = document.getElementById("estado").value;
    const cidade = document.getElementById("cidade").value;
    const bairro = document.getElementById("bairro").value;
    const rua = document.getElementById("rua").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("comp").value;

    const descricao = document.getElementById("descricao").value;

    const resposta = await fetch("/api/cadastro-geral", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nome, email, telefone, tipoDocumento, documento, data, profissao, cep, estado, cidade, bairro, rua, numero, complemento, descricao})
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);

    formCadGeral.reset();
});