
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import formatarNome from "../utils/formatarNome";

export default function Search() {

  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);

  const navigate = useNavigate();

  async function buscar(valor) {

    setTexto(valor);

    if (valor.length < 2) {
      setResultados([]);
      return;
    }

    try {

      const resposta = await fetch(
        `http://localhost:3001/api/search/${valor}`
      );

      const dados = await resposta.json();

      setResultados(dados);

    } catch (erro) {
      console.log("Erro ao buscar");
    }
  }

  function abrirResultado(resultado) {

    if (resultado.tipo === "monster") {
      navigate(`/monsters/${resultado.id}`);
    }

    if (resultado.tipo === "item") {
      navigate(`/items/${resultado.id}`);
    }
  }

  return (
    <div className="page-container">

      <h1 className="page-title">
        Buscador
      </h1>

      <input
        type="text"
        placeholder="Pesquisar item, monstro, carta..."
        value={texto}
        onChange={(e) => buscar(e.target.value)}
        className="search-input"
      />

      <div className="results-container">

        {resultados.map((resultado) => (

          <div
            key={`${resultado.tipo}-${resultado.id}`}
            className="result-card"
            onClick={() => abrirResultado(resultado)}
          >
            <div className="result-title">
              {formatarNome(resultado.nome)}
            </div>

            <div className="result-type">
              {formatarNome(resultado.tipo)}
            </div>
          </div>

        ))}

      </div>

    </div>
  );
}
