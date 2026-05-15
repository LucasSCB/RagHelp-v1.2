function normalize(texto = "") {

  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

module.exports = normalize;
