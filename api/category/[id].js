// export default async function handler(req, res) {
  
//  const { idd } = req.query;
//  const { idd2 } = req.params;

//   try {
//     const response = await fetch(`https://tienda.mercadona.es/api/categories/${idd2}/`);
//     if (!response.ok) {
//       return res.status(response.status).json({ error: "Error al obtener datos de la categoría" });
//     }
//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error en el servidor" });
//   }
// }
// // //



import fetch from "node-fetch";

// 🔄 Fetch con retry
async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status} al obtener ${url}`);
      }

      // leer la respuesta como texto
      const text = await res.text();
      try {
        return JSON.parse(text); // intentar parsear
      } catch {
        throw new Error(`Respuesta no JSON de ${url}: ${text.slice(0, 100)}...`);
      }

    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} para ${url}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 500)); // espera más antes de reintentar
    }
  }
}



// 🔹 Fetch en lotes (batching)
async function fetchInBatches(ids, batchSize = 10, delay = 500) {
  let results = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    console.log(`⏳ Procesando batch ${i / batchSize + 1} (${batch.length} items)`);

    const batchResults = await Promise.allSettled(
      batch.map((id) =>
        fetchWithRetry(`https://tienda.mercadona.es/api/categories/${id}/`, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        })
      )
    );

    results = results.concat(
      batchResults.filter((r) => r.status === "fulfilled").map((r) => r.value)
    );

    // espera entre batches para no saturar la API
    if (i + batchSize < ids.length) {
      console.log(`⏸ Esperando ${delay}ms antes del siguiente batch...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return results;
}

export default async function handler(req, res) {
  try {
    // 2️⃣ Obtener datos en lotes
    const allData = await fetchInBatches(ids, 10, 500); // batchSize=10, delay=500ms

    console.log("✅ Total resultados:", allData.length);

    // 3️⃣ Enviar respuesta
    res.status(200).json({
      subcategories: allData,
    });
  } catch (error) {
    console.error("Error general en handler:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

