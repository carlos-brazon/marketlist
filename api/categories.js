import fetch from "node-fetch";

export default async function handler(req, res) {
  const response = await fetch("https://tienda.mercadona.es/api/categories/");
  const data = await response.json();
  console.log(data);
  
  res.status(200).json(data);
}
