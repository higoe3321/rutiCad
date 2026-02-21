const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function enviarEmail({ to, subject, text }) {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const mensagem = [
    `From: ${process.env.GMAIL_USER}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
  ].join("\n");

  const encodedMessage = Buffer.from(mensagem)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

module.exports = { enviarEmail };