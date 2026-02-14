async function carregarLista() {
  try {
    const resposta = await fetch(
      "/api/relatorio/lista"
    );
    const dados = await resposta.json();

    const tbody = document.getElementById("tabelaRelatorio");
    tbody.innerHTML = "";

    dados.forEach((visita) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <a href="detalhesRelatorio.html?id=${visita.ID}">
            ${visita.DATA}
          </a>
        </td>
        <td>${visita.ASSUNTO}</td>
        <td>
          <button onclick="excluir(${visita.ID})">Excluir</button>
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

  await fetch(`/api/relatorio/${id}`, {
    method: "DELETE",
  });

  carregarLista();
}

carregarLista();

