export default async function handler(req, res) {
 const { id } = req.query;
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
}

