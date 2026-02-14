async function carregarLista() {
  try {
    const resposta = await fetch(
      "http://localhost:3000/api/cadastro-geral/lista",
    );
    const dados = await resposta.json();

    const tbody = document.getElementById("tabelaCadastros");
    tbody.innerHTML = "";

    dados.forEach((pessoa) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
        <input type="checkbox" id="idSelecionado${pessoa.ID} " name="idSelecionado${pessoa.ID}" value="${pessoa.ID}">
        </td>
        <td>
          <a href="detalhesCadGeral.html?id=${pessoa.ID}">
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

  await fetch(`http://localhost:3000/api/cadastro-geral/${id}`, {
    method: "DELETE",
  });

  carregarLista();
}

carregarLista();

document.getElementById("btn").addEventListener("click", () => {
  const ids = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
    ids.push(cb.value);
  });

  localStorage.setItem("dados", JSON.stringify(ids));
  window.location.href = "emailPlural.html";
});
