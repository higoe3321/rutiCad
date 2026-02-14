async function carregarLista() {
  try {
    const resposta = await fetch(
      "http://localhost:3000/api/cadastro-politico/lista"
    );
    const dados = await resposta.json();

    const tbody = document.getElementById("tabelaCadastros");
    tbody.innerHTML = "";

    dados.forEach((pessoa) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <a href="detalhesCadPolitico.html?id=${pessoa.ID}">
            ${pessoa.NOME}
          </a>
        </td>
        <td>${pessoa.EMAIL}</td>
        <td>
          <button onclick="excluir(${pessoa.ID})">Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  } catch (erro) {
    console.error("Erro ao carregar lista", erro);
  }
}

async function excluir(id) {
  if (!confirm("Deseja excluir este cadastro?")) return;

  await fetch(`http://localhost:3000/api/cadastro-politico/${id}`, {
    method: "DELETE",
  });

  carregarLista();
}

carregarLista();
