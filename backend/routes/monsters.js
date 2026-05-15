const express = require("express");

const router = express.Router();

const { buscarMonstro } = require("../services/ragnapi");
const traducoes = require("../utils/traducoes");
const normalizeKey = require("../utils/normalizeKey");

router.get("/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const dados = await buscarMonstro(id);

    const monstroLimpo = {
      id,

      nome:
        traducoes[normalizeKey(dados.monster_info)] ||
        dados.monster_info ||
        "Nome não encontrado",

      imagem:
        dados.gif ||
        "",

      nivel:
        dados.main_stats?.level ||
        "Não informado",

      hp:
        dados.main_stats?.hp ||
        "Não informado",

      raca:
        dados.race ||
        "Não informado",

      elemento:
        dados.type ||
        "Não informado",

      tamanho:
        dados.size ||
        "Não informado",

      experiencia:
        dados.main_stats?.base_exp ||
        "Não informado",

      jobExp:
        dados.main_stats?.job_exp ||
        "Não informado",

      ataque:
        dados.main_stats?.attack ||
        "Não informado",

      defesa:
        dados.main_stats?.def ||
        "Não informado",

      aspd:
        dados.main_stats?.aspd ||
        "Não informado",

      flee:
        dados.main_stats?.flee ||
        "Não informado",

      hit:
        dados.main_stats?.hit ||
        "Não informado",

      drops:
        dados.drops || [],

      mapas:
        dados.maps || []
    };

    res.json(monstroLimpo);

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: true,
      mensagem: "Erro ao processar monstro"
    });
  }
});

module.exports = router;