
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import formatarNome from "../utils/formatarNome"; // Importa a função de formatação de nome
const API_URL = import.meta.env.VITE_API_URL;

export default function MonsterDetails() {

  const { id } = useParams();

  const [monster, setMonster] = useState(null);

  useEffect(() => {

    async function carregar() {

      const resposta = await fetch( 
        `${API_URL}/api/monsters/${id}` 
        );

      const dados = await resposta.json();

      setMonster(dados);
    }

    carregar();

  }, [id]);

  if (!monster) {
    return <div className="page-container">Carregando...</div>;
  }

  return (
    <div className="page-container">

      <div className="monster-header">

        <img
          src={monster.imagem}
          alt={monster.nome}
          className="monster-image"
        />

        <div>
          <h1 className="page-title">
            {monster.nome}
          </h1>

          <p><strong>HP:</strong> {monster.hp}</p>
          <p><strong>Raça:</strong> {monster.raca}</p>
          <p><strong>Elemento:</strong> {monster.elemento}</p>
          <p><strong>Tamanho:</strong> {monster.tamanho}</p>
          <p><strong>EXP Base:</strong> {monster.experiencia}</p>
          <p><strong>EXP Job:</strong> {monster.jobExp}</p>
          <p><strong>Ataque:</strong> {monster.ataque}</p>
          <p><strong>Defesa:</strong> {monster.defesa}</p>
          <p><strong>ASPD:</strong> {monster.aspd}</p>
          <p><strong>Flee:</strong> {monster.flee}</p>
          <p><strong>Hit:</strong> {monster.hit}</p>
        </div>

      </div>

      <h2 className="section-title">
        Drops
      </h2>

      <div className="drops-grid">

        {monster.drops.map((drop, index) => (

          <div key={index} className="drop-card">

            <img
              src={drop.img}
              alt={drop.name}
              className="drop-image"
            />

            <div>
              <div className="drop-name">{formatarNome(drop.name)}</div>
              <div className="drop-rate">{drop.rate}%</div>
            </div>

          </div>

        ))}

      </div>

      <h2 className="section-title">
        Mapas
      </h2>

      <div className="maps-grid">

        {monster.mapas.map((mapa, index) => (

          <div key={index} className="map-card">

            <img
              src={mapa.img}
              alt={mapa.name}
              className="map-image"
            />

            <div>
              <div className="map-name">
                {mapa.name} {mapa.number}
              </div>

              <div className="map-info">
                {mapa.amount} monstros
              </div>

              <div className="map-info">
                Respawn: {mapa.frequency || "desconhecido"}
              </div>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
