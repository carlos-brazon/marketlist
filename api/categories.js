import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data/mercadonaProducts.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(rawData);

    res.status(200).json({ subcategories: products });
  } catch (err) {
    console.error("Error al leer JSON:", err);
    res.status(500).json({ error: "Error al leer productos" });
  }
}
