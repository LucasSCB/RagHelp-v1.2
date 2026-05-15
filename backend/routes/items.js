const express = require("express");

const router = express.Router();

const { buscarItem } = require("../services/ragnapi");

const searchIndex = require("../data/searchIndex.json");

const traducoes = require("../utils/traducoes");

/*
|--------------------------------------------------------------------------
| TRADUÇÃO
|--------------------------------------------------------------------------
*/

function traduzirNome(nome) {

  if (!nome) return "";

  const chave = nome
    .toLowerCase()
    .replaceAll(" ", "_")
    .trim();

  return traducoes[chave] || nome;
}

/*
|--------------------------------------------------------------------------
| ENCONTRAR ID DO MONSTRO
|--------------------------------------------------------------------------
*/

function encontrarMonsterId(nome) {

  const nomeNormalizado = nome
    ?.toLowerCase()
    .replaceAll(" ", "_")
    .trim();

  const encontrado = searchIndex.find((objeto) => {

    const objetoNome = objeto.nome
      ?.toLowerCase()
      .replaceAll(" ", "_")
      .trim();

    return (
      objeto.tipo === "monster" &&
      objetoNome === nomeNormalizado
    );
  });

  return encontrado?.id || null;
}

/*
|--------------------------------------------------------------------------
| ITEM COMPLETO
|--------------------------------------------------------------------------
*/

router.get("/:id", async (req, res) => {

  const { id } = req.params;

  try {

    const dados = await buscarItem(id);

    console.log(dados);

    const itemLimpo = {

      id,

      nome:
        traduzirNome(dados.name),

      nomeOriginal:
        dados.name,

      imagem:
        dados.img || "",

      descricao:
        dados.description || "",

      habilidades:
        dados.skills || [],

      modificadores:
        dados.size_modifier || [],

      equipavel:
        dados.equipable || {},

      dropadoPor:
        (dados.drop_rate || []).map((drop) => ({

          ...drop,

          monsterOriginal:
            drop.monster,

          monster:
            traduzirNome(drop.monster),

          monster_id:
            encontrarMonsterId(drop.monster)

        }))
    };

    /*
    |--------------------------------------------------------------------------
    | CAMPOS DINÂMICOS
    |--------------------------------------------------------------------------
    */

    if (dados.type) {
      itemLimpo.tipo = dados.type;
    }

    if (dados.weight) {
      itemLimpo.peso = dados.weight;
    }

    if (dados.slots) {
      itemLimpo.slots = dados.slots;
    }

    if (dados.attack) {
      itemLimpo.ataque = dados.attack;
    }

    if (dados.defense) {
      itemLimpo.defesa = dados.defense;
    }

    if (dados.weapon_level) {
      itemLimpo.weaponLevel = dados.weapon_level;
    }

    if (dados.refinable) {
      itemLimpo.refinavel = true;
    }

    if (dados.buy_price) {
      itemLimpo.precoCompra = dados.buy_price;
    }

    if (dados.sell_price) {
      itemLimpo.precoVenda = dados.sell_price;
    }

    res.json(itemLimpo);

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: true,
      mensagem: "Erro ao processar item"
    });
  }
});

module.exports = router;