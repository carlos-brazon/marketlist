// import fetch from "node-fetch";

// export default async function handler(req, res) {
//   const response = await fetch("https://tienda.mercadona.es/api/categories/");
//   const data = await response.json();


  
//   res.status(200).json(data);
// }




import fetch from "node-fetch";

export default async function handler(req, res) {
  const response = await fetch("https://tienda.mercadona.es/api/categories/");
  const data = await response.json();
  res.status(200).json(data);

const ids = data.results.flatMap(cat =>
          cat.categories.map(sub => sub.id)
        );
    console.log("Todos los IDs categories:", ids);

    const allData = await Promise.all(
            ids.map(id =>
              fetch(`https://tienda.mercadona.es/api/categories/${id}/`), {
                headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
          }
              }
              // fetch(`http://localhost:3001/category/${id}/`)
                .then(res => {
                  if (!res.ok) throw new Error(`Error al obtener categoría ${id}`);
                  return res.json();
                })
                .catch(err => {
                  console.error(err);
                  return null; // para que no rompa Promise.all
                })
            )
          );
          console.log('allData:', allData);
          
}
