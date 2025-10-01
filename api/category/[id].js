export default async function handler(req, res) {
  console.log('req', req);
  
 const { idd } = req.query;
 const { idd2 } = req.params;
 console.log('idd',idd);
 console.log('idd2',idd2);
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

