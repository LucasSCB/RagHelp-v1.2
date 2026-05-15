export default function formatarNome(nome) {

  if (!nome) return "";

  return nome
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) =>
      letra.toUpperCase()
    );
}