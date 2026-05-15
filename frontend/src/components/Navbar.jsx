
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        RagHelp
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/search">Buscador</Link>
        <Link to="/farm-routes">Rotas Farm</Link>
        <Link to="/about">Sobre</Link>
      </div>
    </nav>
  );
}
