// import fetch from "node-fetch";

// export default async function handler(req, res) {
//   const response = await fetch("https://tienda.mercadona.es/api/categories/");
//   const data = await response.json();


  
//   res.status(200).json(data);
// }

      
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // 1️⃣ Obtener todas las categorías principales
    const response = await fetch("https://tienda.mercadona.es/api/categories/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Error al obtener categorías principales" });
    }

    const data = await response.json();

    // Extraer todos los IDs de subcategorías
    const ids = data.results.flatMap(cat =>
      cat.categories.map(sub => sub.id)
    );
    console.log("Todos los IDs categories:", ids);

    const testId = ['112', '115', '156', '89']

    // 2️⃣ Obtener datos de cada subcategoría con Promise.allSettled
    const allDataResults = await Promise.allSettled(
      ids.map(id =>
        fetch(`https://tienda.mercadona.es/api/categories/${id}/`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
          },
        })
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


    // 3️⃣ Enviar la respuesta final
    res.status(200).json({
      categories: data.results,
      subcategories: allData,
    });

  } catch (err) {
    console.error("Error general en handler:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

