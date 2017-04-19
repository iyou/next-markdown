const qs = require('qs');
import fetch from 'node-fetch';


const CLIENT_ID = 'cf56c38082267ae13bdf';
const CLIENT_SECRET = '0adba75f977c0ff7ade2e6ab3086fd49d762e35a';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';


export const getGithubToken = (code) => {
  const query = qs.stringify({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    accept: 'json'
  })
  
  return fetch(`${TOKEN_URL}?${query}`, {method: 'post'})
          .then((res) => res.text())
          .then((text) => qs.parse(text))
}
