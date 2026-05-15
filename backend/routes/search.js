const express = require("express");

const router = express.Router();

const searchIndex = require("../data/searchIndex.json");

const normalizarTexto = require("../utils/normalizarTexto");
const traducoes = require("../utils/traducoes");

function expandirTermos(termoOriginal) {

  const termos = [termoOriginal];

  Object.entries(traducoes).forEach(([ingles, aliases]) => {

    const listaAliases = Array.isArray(aliases)
      ? aliases
      : [aliases];

    listaAliases.forEach((alias) => {

      if (termoOriginal.includes(alias)) {
        termos.push(ingles);
      }

      if (termoOriginal.includes(ingles)) {
        termos.push(alias);
      }

    });

  });

  return termos;
}

router.get("/:termo", (req, res) => {

  const termo = normalizarTexto(req.params.termo);

  const termosBusca = expandirTermos(termo);

  const resultados = searchIndex.filter((objeto) => {

    const campos = [
      objeto.nome,
      ...(objeto.aliases || [])
    ]
    .map(normalizarTexto)
    .join(" ");

    return termosBusca.some((termoExpandido) =>
      campos.includes(termoExpandido)
    );
  });

  res.json(resultados.slice(0, 50));
});

module.exports = router;