const fs = require("fs");
const { google } = require("googleapis");
const CREDENTIALS = require("./credentials.json");

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.web.client_id,
  CREDENTIALS.web.client_secret,
  "http://localhost:3000/oauth2callback"
);

oAuth2Client.getToken(
  "4/0AfrIepCZAx4DE-6MHEkmuiB06OINMz6111DbG-SbhwbgY3HIGOtkaPUcWhqU6-GGc1_jfg&scope",
  (err, token) => {
    if (err) {
      console.error("Erro ao gerar token:", err);
      return;
    }
    fs.writeFileSync("token.json", JSON.stringify(token));
    console.log("Token gerado!");
  }
);