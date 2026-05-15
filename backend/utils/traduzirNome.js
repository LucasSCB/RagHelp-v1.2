const traducoes = require("./traducoes");

function traduzirNome(nome) {

  if (!nome) return "";

  const chave = nome
    .toLowerCase()
    .replaceAll(" ", "_")
    .trim();

  return traducoes[chave] || nome;
}

module.exports = traduzirNome;