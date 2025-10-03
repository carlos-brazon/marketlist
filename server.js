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

    // Extraer todos los IDs de subcategorías
    const ids = data.results.flatMap(cat =>
      cat.categories.map(sub => sub.id)
    );
    const testId = ["112",'161']    

    // Endpoint para obtener los datos de una categoría por ID

    const allDataResults = await Promise.allSettled(
      testId.map(id =>
        fetch(`https://tienda.mercadona.es/api/categories/${id}/`)
          .then(res => {
            if (!res.ok) throw new Error(`Error al obtener categoría ${id}`);
            return res.json();
          })
      )
    );
    // Filtrar las respuestas exitosas
    const allData = allDataResults
      .filter(r => r.status === "fulfilled")
      .map(r => r.value);

    res.status(200).json({
      subcategories: allData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Iniciamos el servidor
const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server corriendo en http://localhost:${PORT}`));

