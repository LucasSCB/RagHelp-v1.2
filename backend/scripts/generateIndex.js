const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ragnapi.com/api/v1/re-newal";

// até onde ele vai testar IDs
const ID_INICIAL = 1;
const ID_FINAL = 30000;

// pausa entre requisições para não sobrecarregar a API
const DELAY = 80;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function buscarNaApi(url) {
  try {
    const resposta = await fetch(url);

    if (!resposta.ok) {
      return null;
    }

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    return null;
  }
}

function montarItem(id, dados) {
  const nome =
    dados.name ||
    dados.item_name ||
    dados.item_info ||
    dados.nome ||
    null;

  if (!nome) return null;

  return {
    id,
    tipo: "item",
    nome,
    nomeNormalizado: normalizarTexto(nome),
    aliases: [
      nome,
      dados.name,
      dados.item_name,
      dados.item_info
    ].filter(Boolean)
  };
}

function montarMonstro(id, dados) {
  const nome =
    dados.name ||
    dados.monster_name ||
    dados.monster_info ||
    dados.nome ||
    null;

  if (!nome) return null;

  return {
    id,
    tipo: "monster",
    nome,
    nomeNormalizado: normalizarTexto(nome),
    aliases: [
      nome,
      dados.name,
      dados.monster_name,
      dados.monster_info
    ].filter(Boolean)
  };
}

async function gerarIndex() {
  const index = [];

  for (let id = ID_INICIAL; id <= ID_FINAL; id++) {
    console.log(`Testando ID ${id}...`);

    const item = await buscarNaApi(`${BASE_URL}/items/${id}`);

    if (item) {
      const itemFormatado = montarItem(id, item);

      if (itemFormatado) {
        index.push(itemFormatado);
        console.log(`Item encontrado: ${itemFormatado.nome}`);
      }
    }

    await esperar(DELAY);

    const monstro = await buscarNaApi(`${BASE_URL}/monsters/${id}`);

    if (monstro) {
      const monstroFormatado = montarMonstro(id, monstro);

      if (monstroFormatado) {
        index.push(monstroFormatado);
        console.log(`Monstro encontrado: ${monstroFormatado.nome}`);
      }
    }

    await esperar(DELAY);
  }

  const pastaData = path.join(__dirname, "..", "data");
  const arquivoSaida = path.join(pastaData, "searchIndex.json");

  if (!fs.existsSync(pastaData)) {
    fs.mkdirSync(pastaData);
  }

  fs.writeFileSync(arquivoSaida, JSON.stringify(index, null, 2), "utf-8");

  console.log("--------------------------------");
  console.log("Index gerado com sucesso!");
  console.log(`Total encontrado: ${index.length}`);
  console.log(`Arquivo salvo em: ${arquivoSaida}`);
}

gerarIndex();