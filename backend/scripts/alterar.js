const fs = require("fs");

const aliases = require("../data/customAliases.json");

const fixedAliases = {};

for (const [key, value] of Object.entries(aliases)) {
  const normalizedKey = key.toLowerCase();

  fixedAliases[normalizedKey] = value;
}

fs.writeFileSync(
  "../data/customAliases.json",
  JSON.stringify(fixedAliases, null, 2)
);

console.log("Aliases corrigidos!");