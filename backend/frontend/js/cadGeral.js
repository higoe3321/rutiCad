if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


let listaCompleta = [];

async function carregarLista() {
  try {
    const resposta = await fetch("/api/cadastro-geral/lista");
    const dados = await resposta.json();

    listaCompleta = dados; // salva tudo em memória
    renderizarTabela(dados);
  } catch (erro) {
    console.error("Erro ao carregar lista", erro);
  }
}

function renderizarTabela(dados) {
  const tbody = document.getElementById("tabelaCadastros");
  tbody.innerHTML = "";

  dados.forEach((pessoa) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input 
          type="checkbox" 
          name="idSelecionado${pessoa.ID}" 
          value="${pessoa.ID}"
        >
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
}

// 🔍 Pesquisa em tempo real
document.getElementById("pesquisa").addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();

  const filtrados = listaCompleta.filter((pessoa) =>
    pessoa.NOME.toLowerCase().includes(texto) ||
    pessoa.EMAIL.toLowerCase().includes(texto)
  );

  renderizarTabela(filtrados);
});

async function excluir(id) {
  if (!confirm("Deseja excluir este cadastro?")) return;

  await fetch(`/api/cadastro-geral/${id}`, {
    method: "DELETE",
  });

  carregarLista(); // recarrega lista atualizada
}

// botão de email continua funcionando
document.getElementById("btn").addEventListener("click", () => {
  const ids = [];

  document.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
    ids.push(cb.value);
  });

  localStorage.setItem("dados", JSON.stringify(ids));
  window.location.href = "emailPlural.html";
});

carregarLista();