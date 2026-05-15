async function buscarMonstro(id) {

  const resposta = await fetch(
    `https://ragnapi.com/api/v1/re-newal/monsters/${id}`
  );

  return await resposta.json();
}

async function buscarItem(id) {

  const resposta = await fetch(
    `https://ragnapi.com/api/v1/re-newal/items/${id}`
  );

  return await resposta.json();
}

module.exports = {
  buscarMonstro,
  buscarItem
};