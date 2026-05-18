const fs = require("fs");
const path = require("path");

const BASE_URL = "https://ragnapi.com/api/v1";

// ========================================
// CONFIG
// ========================================

const CONFIG = {

  // Quantidade máxima de IDs para testar
  maxItems: 30000,

  // Delay entre requests
  delay: 5,

  // Pasta final
  output: "./database",

  // APIs
  itemApi: `${BASE_URL}/re-newal/items`,
  monsterApi: `${BASE_URL}/old-times/monsters`
};

// ========================================
// HELPERS
// ========================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveJson(file, data) {

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

function normalizeName(name = "") {

  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}

// ========================================
// DATABASES
// ========================================

const DATABASE = {

  items: [],
  consumables: [],
  cards: [],
  equips: [],

  mobs: [],
  bosses: [],
  mvps: []
};

// ========================================
// ITEM CLASSIFIER
// ========================================

function classifyItem(item) {

  const name = item.name?.toLowerCase() || "";

  // ====================================
  // CARD
  // ====================================

  if (name.includes("_card")) {

    DATABASE.cards.push({

      id: item.id,

      name: item.name,

      display_name: normalizeName(item.name),

      type: "card",

      image: item.img,

      description: item.description,

      effects: item.skills || [],

      dropped_by: item.drop_rate || []
    });

    return;
  }

  // ====================================
  // CONSUMABLE
  // ====================================

  const isConsumable =
    item.description?.toLowerCase().includes("restores") ||
    item.description?.toLowerCase().includes("recover") ||
    item.description?.toLowerCase().includes("potion");

  if (isConsumable) {

    DATABASE.consumables.push({

      id: item.id,

      name: item.name,

      display_name: normalizeName(item.name),

      type: "consumable",

      image: item.img,

      description: item.description,

      effects: item.skills || []
    });

    return;
  }

  // ====================================
  // EQUIP
  // ====================================

  const isEquip =
    Object.keys(item.equipable || {}).length > 0;

  if (isEquip) {

    DATABASE.equips.push({

      id: item.id,

      name: item.name,

      display_name: normalizeName(item.name),

      type: "equip",

      image: item.img,

      description: item.description,

      effects: item.skills || [],

      equipable: item.equipable
    });

    return;
  }

  // ====================================
  // GENERIC ITEM
  // ====================================

  DATABASE.items.push({

    id: item.id,

    name: item.name,

    display_name: normalizeName(item.name),

    type: "item",

    image: item.img,

    description: item.description,

    drops: item.drop_rate || []
  });
}

// ========================================
// MONSTER CLASSIFIER
// ========================================

function classifyMonster(monster) {

  const modes =
    monster.skills?.mode || [];

  const isMVP =
    modes.includes("mvp");

  const isBoss =
    modes.includes("boss");

  const monsterData = {

    id: monster.monster_id,

    name: monster.monster_info,

    display_name: normalizeName(monster.monster_info),

    image: monster.gif,

    race: monster.race,

    size: monster.size,

    element: `${monster.type} ${monster.element_power}`,

    level: monster.main_stats?.level,

    hp: monster.main_stats?.hp,

    attack: monster.main_stats?.attack,

    drops: monster.drops || [],

    maps: monster.maps || [],

    skills: monster.skills?.spell || []
  };

  // ====================================
  // MVP
  // ====================================

  if (isMVP) {

    DATABASE.mvps.push({

      ...monsterData,

      category: "mvp"
    });

    return;
  }

  // ====================================
  // BOSS
  // ====================================

  if (isBoss) {

    DATABASE.bosses.push({

      ...monsterData,

      category: "boss"
    });

    return;
  }

  // ====================================
  // NORMAL MOB
  // ====================================

  DATABASE.mobs.push({

    ...monsterData,

    category: "mob"
  });
}

// ========================================
// FETCH ITEM
// ========================================

async function fetchItem(id) {

  try {

    const response = await fetch(
      `${CONFIG.itemApi}/${id}`
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();

  } catch {

    return null;
  }
}

// ========================================
// FETCH MONSTER
// ========================================

async function fetchMonster(id) {

  try {

    const response = await fetch(
      `${CONFIG.monsterApi}/${id}`
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();

  } catch {

    return null;
  }
}

// ========================================
// PROCESS ITEMS
// ========================================

async function processItems() {

  console.log("📦 Processando itens...");

  for (let id = 1; id <= CONFIG.maxItems; id++) {

    const item = await fetchItem(id);

    if (item) {

      classifyItem(item);

      console.log(
        `ITEM ${id} -> ${item.name}`
      );
    }

    await sleep(CONFIG.delay);
  }
}

// ========================================
// PROCESS MONSTERS
// ========================================

async function processMonsters() {

  console.log("👹 Processando monstros...");

  for (let id = 1001; id <= 4000; id++) {

    const monster = await fetchMonster(id);

    if (monster) {

      classifyMonster(monster);

      console.log(
        `MONSTER ${id} -> ${monster.monster_info}`
      );
    }

    await sleep(CONFIG.delay);
  }
}

// ========================================
// SAVE DATABASE
// ========================================

function saveDatabase() {

  ensureDir(CONFIG.output);

  ensureDir(`${CONFIG.output}/items`);
  ensureDir(`${CONFIG.output}/monsters`);

  // ITEMS
  saveJson(
    `${CONFIG.output}/items/items.json`,
    DATABASE.items
  );

  saveJson(
    `${CONFIG.output}/items/cards.json`,
    DATABASE.cards
  );

  saveJson(
    `${CONFIG.output}/items/consumables.json`,
    DATABASE.consumables
  );

  saveJson(
    `${CONFIG.output}/items/equips.json`,
    DATABASE.equips
  );

  // MONSTERS
  saveJson(
    `${CONFIG.output}/monsters/mobs.json`,
    DATABASE.mobs
  );

  saveJson(
    `${CONFIG.output}/monsters/bosses.json`,
    DATABASE.bosses
  );

  saveJson(
    `${CONFIG.output}/monsters/mvps.json`,
    DATABASE.mvps
  );
}

// ========================================
// MAIN
// ========================================

async function main() {

  console.log("🚀 Gerando database Ragnarok...");

  await processItems();

  await processMonsters();

  saveDatabase();

  console.log("✅ DATABASE FINALIZADA");
}

main();