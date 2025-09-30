
// server.js
import express from "express";
import fetch from "node-fetch"; // si usas Node >= 18, puedes usar fetch nativo
import cors from "cors";

const app = express();

// Permitir peticiones desde tu frontend en localhost:5173
app.use(cors({
  origin: "http://localhost:5173"
}));

// Endpoint para obtener todas las categorías
app.get("/categories", async (req, res) => {
  try {
    const response = await fetch("https://tienda.mercadona.es/api/categories/");
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error al obtener datos de Mercadona" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Endpoint para obtener los datos de una categoría por ID
app.get("/category/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await fetch(`https://tienda.mercadona.es/api/categories/${id}/`);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Error al obtener datos de la categoría" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Iniciamos el servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server corriendo en http://localhost:${PORT}`));

