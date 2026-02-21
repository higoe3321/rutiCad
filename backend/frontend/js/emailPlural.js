if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }


const form = document.getElementById("formEmail");
const dados = JSON.parse(localStorage.getItem("dados")) || [];
console.log(dados);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    for (const id of dados) {
      // 1️⃣ busca o email
      const resEmail = await fetch(
        `/api/pegar-email/${id}`
      );

      if (!resEmail.ok) {
        throw new Error("Erro ao buscar email");
      }

      const resposta = await resEmail.json();
      const email = resposta[0]?.EMAIL;
      const nome = resposta[0]?.PRIMEIRO_NOME;

      if (!email) {
        console.warn(`Email não encontrado para ID ${id}`);
        continue;
      }

      const mensagem =
        document.getElementById("saudacao").value +
        " " +
        nome +
        ", " +
        document.getElementById("mensagem").value;

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
        throw new Error(`Erro ao enviar email para ${email}`);
      }

      console.log(`Email enviado para ${email}`);
    }

    alert("Todos os emails foram enviados com sucesso!");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Ocorreu um erro durante o envio.");
  }
});
