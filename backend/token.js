const { google } = require("googleapis");
const CREDENTIALS = require("./credentials.json");

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.web.client_id,
  CREDENTIALS.web.client_secret,
  "http://localhost:3000/oauth2callback"
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: [
    "https://www.googleapis.com/auth/gmail.send"
  ],
  prompt: "consent",
});

console.log("Abra essa URL:");
console.log(authUrl);
