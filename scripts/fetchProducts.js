import fs from "fs";
import fetch from "node-fetch";
import pLimit from "p-limit";

// Fetch con retry
//node scripts/fetchProducts.js para hacer el fetch
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Error al obtener ${url}`);
      return await res.json();
    } catch (err) {
      console.error(`Error en ${url}:`, err.message);
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} for ${url}`);
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
}

async function main() {
  const response = await fetch("https://tienda.mercadona.es/api/categories/", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) throw new Error("Error al obtener categorías principales");

  const data = await response.json();
  const ids = data.results.flatMap((cat) =>
    cat.categories.map((sub) => sub.id)
  );

  const limit = pLimit(10);
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

  const allData = allDataResults
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  console.log("Total IDs:", ids.length);
  console.log("Fulfilled:", allData.length);
  console.log(
    "Rejected:",
    allDataResults.filter((r) => r.status === "rejected").length
  );

  fs.writeFileSync(
    "./data/mercadonaProducts.json",
    JSON.stringify(allData, null, 2)
  );
  console.log("Archivo JSON generado: ./data/mercadonaProducts.json");
}

main().catch((err) => console.error(err));
