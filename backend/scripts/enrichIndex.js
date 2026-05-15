const fs = require("fs");
const path = require("path");

const searchIndexPath = path.join(
  __dirname,
  "..",
  "data",
  "searchIndex.json"
);

const customAliasesPath = path.join(
  __dirname,
  "..",
  "data",
  "customAliases.json"
);

const searchIndex = require(searchIndexPath);
const customAliases = require(customAliasesPath);

/*
|------------------------------------------------------------------
| NORMALIZADOR
|------------------------------------------------------------------
*/

function normalize(texto = "") {

  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/*
|------------------------------------------------------------------
| CATEGORIAS
|------------------------------------------------------------------
*/

const categorias = [

  {
    match: ["card"],
    categoria: "card",
    aliases: ["Carta", "Card"]
  },

  {
    match: ["potion"],
    categoria: "consumivel",
    aliases: [
      "Poção",
      "Potion",
      "Consumível",
      "Cura",
      "HP"
    ]
  },

  {
    match: ["sword"],
    categoria: "sword",
    aliases: [
      "Espada",
      "Sword",
      "Arma"
    ]
  },

  {
    match: ["knife", "dagger"],
    categoria: "dagger",
    aliases: [
      "Adaga",
      "Faca",
      "Dagger",
      "Arma"
    ]
  },

  {
    match: ["shield"],
    categoria: "shield",
    aliases: [
      "Escudo",
      "Shield",
      "Defesa"
    ]
  },

  {
    match: ["bow"],
    categoria: "bow",
    aliases: [
      "Arco",
      "Bow",
      "Arma"
    ]
  },

  {
    match: ["staff", "rod"],
    categoria: "staff",
    aliases: [
      "Cajado",
      "Staff",
      "Mágico",
      "Mage"
    ]
  }
];

/*
|------------------------------------------------------------------
| INDEX ENRIQUECIDO
|------------------------------------------------------------------
*/

const novoIndex = searchIndex.map((objeto) => {

  const nomeOriginal = String(objeto.nome || "");

  const nomeNormalizado = normalize(nomeOriginal);

  let aliases = [...(objeto.aliases || [])];

  /*
  |----------------------------------------------------------------
  | CUSTOM ALIASES
  |----------------------------------------------------------------
  */

  Object.entries(customAliases).forEach(([key, values]) => {

    const keyNormalizada = normalize(key);

    /*
    |--------------------------------------------------------------
    | MATCH FLEXÍVEL
    |--------------------------------------------------------------
    */

    if (
      nomeNormalizado.includes(keyNormalizada)
      || keyNormalizada.includes(nomeNormalizado)
    ) {

      aliases.push(...values);
    }
  });

  /*
  |----------------------------------------------------------------
  | CATEGORIAS
  |----------------------------------------------------------------
  */

  let categoriaFinal = objeto.categoria || null;

  categorias.forEach((categoria) => {

    categoria.match.forEach((palavra) => {

      const palavraNormalizada = normalize(palavra);

      if (nomeNormalizado.includes(palavraNormalizada)) {

        aliases.push(...categoria.aliases);

        categoriaFinal = categoria.categoria;
      }
    });
  });

  /*
  |----------------------------------------------------------------
  | NORMALIZA ALIASES
  |----------------------------------------------------------------
  */

  aliases = aliases
    .map(alias => String(alias).trim())
    .filter(Boolean);

  /*
  |----------------------------------------------------------------
  | REMOVE DUPLICADOS IGNORANDO CASE
  |----------------------------------------------------------------
  */

  const vistos = new Set();

  aliases = aliases.filter((alias) => {

    const normalizado = normalize(alias);

    if (vistos.has(normalizado)) {
      return false;
    }

    vistos.add(normalizado);

    return true;
  });

  return {

    ...objeto,

    categoria: categoriaFinal,

    aliases
  };
});

/*
|------------------------------------------------------------------
| SALVAR
|------------------------------------------------------------------
*/

fs.writeFileSync(
  searchIndexPath,
  JSON.stringify(novoIndex, null, 2),
  "utf-8"
);

console.log("✅ Index enriquecido com sucesso!");