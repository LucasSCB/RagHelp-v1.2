function normalizeKey(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/-/g, "_")
    .replace(/\s+/g, "_")
    .trim();
}

module.exports = normalizeKey;