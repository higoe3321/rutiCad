const fs = require("fs");
const { google } = require("googleapis");
const CREDENTIALS = require("./credentials.json");

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.web.client_id,
  CREDENTIALS.web.client_secret,
  "http://localhost:3000/oauth2callback"
);

const code = "4/0AXEQxIC976YiE_2WkDpZlfe6Sb31i1v33R5U7JfTf03ABRZcNoekuWdzIwhXeDR34KU6kQ";

oAuth2Client.getToken(code, (err, token) => {
  if (err) {
    console.error("Erro ao gerar token:", err);
    return;
  }

  console.log(token);

  fs.writeFileSync("token.json", JSON.stringify(token, null, 2));
  console.log("Token salvo!");
});
