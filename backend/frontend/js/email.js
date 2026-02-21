if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


const form = document.getElementById("formEmail");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log("ID do usuário:", id);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  try {
    // 1️⃣ busca o email no backend
    const resEmail = await fetch(
      `/api/pegar-email/${id}`
    );

    if (!resEmail.ok) {
      throw new Error("Erro ao buscar email");
    }

    const dados = await resEmail.json();
    const email = dados[0]?.EMAIL;
    const nome = dados[0]?.PRIMEIRO_NOME;
    console.log(nome);

    if (!email) {
      alert("Email não encontrado");
      return;
    }

    const mensagem = document.getElementById("saudacao").value + " " + nome + ", " + document.getElementById("mensagem").value;
    const assunto = document.getElementById("assunto").value;


    // 2️⃣ envia o email
    const resEnvio = await fetch(
      "/api/enviar-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assunto, mensagem }),
      }
    );

    if (!resEnvio.ok) {
      throw new Error("Erro ao enviar email");
    }

    alert("Enviado com sucesso!");
    form.reset();

  } catch (err) {
    console.error(err);
    alert("Ocorreu um erro. Tente novamente.");
  }
});
