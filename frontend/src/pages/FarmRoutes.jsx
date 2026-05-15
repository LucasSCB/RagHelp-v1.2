import { useState } from "react"
import { farmRoutes } from "../data/farmRoutes"
import "../styles/farmRoutes.css"
import logo from "../assets/logo.png"

function FarmRoutes() {
  const [rotaSelecionada, setRotaSelecionada] = useState(farmRoutes[0])

  return (
    <main className="farm-page">
      <section className="farm-panel">
            <div className="logo-area">
              <img src={logo} alt="Logo do jogo" className="logo-img" />
            </div>
        <div className="level-buttons">
          {farmRoutes.map((rota) => (
            <button
              key={rota.level}
              className={
                rotaSelecionada.level === rota.level
                  ? "level-button active"
                  : "level-button"
              }
              onClick={() => setRotaSelecionada(rota)}
            >
              {rota.level}
            </button>
          ))}
        </div>

        <section className="route-card">
          <h2>{rotaSelecionada.nomeMapa}</h2>

          <div className="route-content">
            <div className="route-info">
              <p>
                <strong>Mapa:</strong> {rotaSelecionada.localizacao}
              </p>

              <div className="items-box">
                <strong>Possíveis drops:</strong>

                <div className="tier-legend">
                  <span className="tier tier-1">● Tier 1</span>
                  <span className="tier tier-2">● Tier 2</span>
                  <span className="tier tier-3">● Tier 3</span>
                </div>

                <ul>
                  {rotaSelecionada.itens.map((item) => (
                    <li key={item.nome} className={`item-tier-${item.tier}`}>
                      {item.nome}
                    </li>
                  ))}
                </ul>
              </div>

              <p>
                <strong>EXP por hora:</strong> {rotaSelecionada.expHora}
              </p>

              <div className="mobs-box">
                <strong>Mobs para caçar:</strong>

                <div className="mobs-list">
                  {rotaSelecionada.mobs.map((mob) => (
                    <div className="mob-card" key={mob.nome}>
                      <img src={mob.imagem} alt={mob.nome} />
                      <span>{mob.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="map-area">
              <img
                src={rotaSelecionada.imagemMapa}
                alt={rotaSelecionada.nomeMapa}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default FarmRoutes