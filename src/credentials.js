import fs from 'fs';
import path from 'path';

const CREDENTIALS_FILE = path.resolve(__dirname, '../secrets/credentials.json');
const TOKENS_FILE = path.resolve(__dirname, '../secrets/tokens.json');

export function getCredentials() {
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    console.error(`Credentials file ${CREDENTIALS_FILE} missing! Download the JSON file from https://console.developers.google.com/apis/credentials.`);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE).toString());

  return {
    clientId: credentials.web.client_id,
    clientSecret: credentials.web.client_secret,
  };
}

export function setTokens(tokens) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens));
}

export function getTokens() {
  if (!fs.existsSync(TOKENS_FILE)) return null;

  return JSON.parse(fs.readFileSync(TOKENS_FILE).toString());
}
