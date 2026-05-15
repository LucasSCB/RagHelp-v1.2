import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import FormatarNome from "../utils/formatarNome";
const API_URL = import.meta.env.VITE_API_URL;

export default function ItemDetails() {

  const { id } = useParams();

  const [item, setItem] = useState(null);

  useEffect(() => {

    async function carregar() {

      try {

        const resposta = await fetch( `${API_URL}/api/items/${id}` );

        const dados = await resposta.json();

        setItem(dados);

      } catch (erro) {

        console.log(erro);
      }
    }

    carregar();

  }, [id]);

  if (!item) {
    return (
      <div className="page-container">
        Carregando...
      </div>
    );
  }

  return (
    <div className="page-container">

      <h1 className="page-title">
        {FormatarNome(item.nome)}
      </h1>

      {item.imagem && (
        <img
          src={item.imagem}
          alt={item.nome}
          className="monster-image"
        />
      )}

      <div className="info-box">

        {item.tipo && (
          <p>
            <strong>Tipo:</strong> {item.tipo}
          </p>
        )}

        {item.peso && (
          <p>
            <strong>Peso:</strong> {item.peso}
          </p>
        )}

        {item.slots > 0 && (
          <p>
            <strong>Slots:</strong> {item.slots}
          </p>
        )}

        {item.ataque && (
          <p>
            <strong>Ataque:</strong> {item.ataque}
          </p>
        )}

        {item.defesa && (
          <p>
            <strong>Defesa:</strong> {item.defesa}
          </p>
        )}

        {item.refinavel && (
          <p>
            <strong>Refinável:</strong> Sim
          </p>
        )}

        {item.descricao && (
          <p>
            <strong>Descrição:</strong> {item.descricao}
          </p>
        )}

      </div>

      {item.dropadoPor?.length > 0 && (
        <>
          <h2 className="section-title">
            Dropado Por
          </h2>

          <div className="drops-grid">

            {item.dropadoPor.map((drop, index) => (

              <div
                key={index}
                className={`drop-card ${drop.is_mvp ? "mvp-card" : ""}`}
              >

                <div className="drop-header">

                  <div>

                    {drop.monster_id ? (

                      <Link
                        to={`/monsters/${drop.monster_id}`}
                        className="drop-name"
                      >
                        {FormatarNome(drop.monster)}
                      </Link>

                    ) : (

                      <div className="drop-name">
                        {FormatarNome(drop.monster)}
                      </div>

                    )}

                    {drop.is_mvp && (
                      <div className="mvp-badge">
                        MVP BOSS
                      </div>
                    )}

                  </div>

                </div>

                <div className="drop-info">

                  {drop.rate && (
                    <div className="map-info">
                      Chance: {drop.rate}
                    </div>
                  )}

                  {drop.lv && (
                    <div className="map-info">
                      Level: {drop.lv}
                    </div>
                  )}

                  {drop.element && (
                    <div className="map-info">
                      Elemento: {drop.element}
                    </div>
                  )}

                  {drop.highest_spawn && (
                    <div className="map-info">
                      Spawn: {drop.highest_spawn}
                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>
        </>
      )}

    </div>
  );
}
