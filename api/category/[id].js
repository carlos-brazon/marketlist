export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const response = await fetch(`https://tienda.mercadona.es/api/categories/${id}/`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Categoría no encontrada' });
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      console.error(`La categoría ${id} devolvió HTML`);
      res.status(500).json({ error: 'Respuesta inválida' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
}

