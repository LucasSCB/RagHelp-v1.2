const express = require("express");
const cors = require("cors");

const monstersRoutes = require("./routes/monsters");
const itemsRoutes = require("./routes/items");
const searchRoutes = require("./routes/search");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/monsters", monstersRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/search", searchRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "Online",
    mensagem: "Backend RagHelp Funcionando"
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
