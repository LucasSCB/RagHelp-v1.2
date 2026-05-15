
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Search from "./pages/Search";
import FarmRoutes from "./pages/FarmRoutes";
import ItemDetails from "./pages/ItemDetails";
import MonsterDetails from "./pages/MonsterDetails";
import About from "./pages/About";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/farm-routes" element={<FarmRoutes />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/monsters/:id" element={<MonsterDetails />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
