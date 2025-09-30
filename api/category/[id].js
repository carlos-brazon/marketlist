import fetch from "node-fetch";

export default async function handler(req, res) {
  const { id } = req.query; // aquí viene el id de la categoría
  try {
    const response = await fetch(`https://tienda.mercadona.es/api/categories/${id}/`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener categoría" });
  }
}
