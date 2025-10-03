// //

// import fs from "fs";
// import path from "path";

// export default async function handler(req, res) {
//   try {
//     const filePath = path.join(process.cwd(), "data/mercadonaProducts.json");
//     const rawData = fs.readFileSync(filePath, "utf-8");
//     const products = JSON.parse(rawData);

//     res.status(200).json({ subcategories: products });
//   } catch (err) {
//     console.error("Error al leer JSON:", err);
//     res.status(500).json({ error: "Error al leer productos" });
//   }
// }

import fetch from "node-fetch";
import pLimit from "p-limit";

// 🔄 Fetch con retry
async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Error al obtener ${url}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} for ${url}`);
      await new Promise((r) => setTimeout(r, 300)); // espera 300ms antes de reintentar
    }
  }
}
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 1️⃣ Obtener todas las categorías principales
    const response = await fetch(
      "https://tienda.mercadona.es/api/categories/",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error al obtener categorías principales" });
    }

    const data = await response.json();

    // Extraer todos los IDs de subcategorías
    const ids = data.results.flatMap((cat) =>
      cat.categories.map((sub) => sub.id)
    );

    // 2️⃣ Obtener datos de cada subcategoría con concurrencia limitada
    const limit = pLimit(1); // más concurrencia que 5

    const allDataResults = await Promise.allSettled(
      ids.map((id) =>
        limit(() =>
          fetchWithRetry(`https://tienda.mercadona.es/api/categories/${id}/`, {
            headers: {
              "User-Agent": "Mozilla/5.0",
              Accept: "application/json",
            },
          })
        )
      )
    );

    // Filtrar las respuestas exitosas
    const allData = allDataResults
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    // 📊 Logs en consola de Vercel
    console.log("Total IDs:", ids.length);
    console.log("Fulfilled:", allData.length);
    console.log(
      "Rejected:",
      allDataResults.filter((r) => r.status === "rejected").length
    );

    // 3️⃣ Enviar la respuesta final
    res.status(200).json({
      subcategories: allData,
    });
  } catch (error) {
    console.error("Error general en handler:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
// import fs from "fs";
// import fetch from "node-fetch";
// import pLimit from "p-limit";

// // Fetch con retry
// async function fetchWithRetry(url, options, retries = 3) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) throw new Error(`Error al obtener ${url}`);
//       return await res.json();
//     } catch (err) {
//       if (i === retries - 1) throw err;
//       console.warn(`Retry ${i + 1} for ${url}`);
//       await new Promise((r) => setTimeout(r, 300));
//     }
//   }
// }

// async function main() {
//   const response = await fetch("https://tienda.mercadona.es/api/categories/", {
//     headers: {
//       "User-Agent": "Mozilla/5.0",
//       Accept: "application/json",
//     },
//   });

//   if (!response.ok) throw new Error("Error al obtener categorías principales");

//   const data = await response.json();
//   const ids = data.results.flatMap((cat) =>
//     cat.categories.map((sub) => sub.id)
//   );

//   const limit = pLimit(20);
//   const allDataResults = await Promise.allSettled(
//     ids.map((id) =>
//       limit(() =>
//         fetchWithRetry(`https://tienda.mercadona.es/api/categories/${id}/`, {
//           headers: {
//             "User-Agent": "Mozilla/5.0",
//             Accept: "application/json",
//           },
//         })
//       )
//     )
//   );

//   const allData = allDataResults
//     .filter((r) => r.status === "fulfilled")
//     .map((r) => r.value);

//   console.log("Total IDs:", ids.length);
//   console.log("Fulfilled:", allData.length);
//   console.log(
//     "Rejected:",
//     allDataResults.filter((r) => r.status === "rejected").length
//   );

//   // fs.writeFileSync(
//   //   "./data/mercadonaProducts.json",
//   //   JSON.stringify(allData, null, 2)
//   // );
//    res.status(200).json({
//       subcategories: allData,
//     });
//   console.log("Archivo JSON generado: ./data/mercadonaProducts.json");
// }

// main().catch((err) => console.error(err));