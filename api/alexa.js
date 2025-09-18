// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).send("Solo POST permitido");

//   const item = req.body.queryResult?.parameters?.item;
//   if (!item) return res.status(400).json({ error: "No se recibió item" });

//   await db.collection("dataItemsMarketList2").add({
//     name: item.toLowerCase(),
//     tags: "compras",
//     isDone: false,
//     create_at: new Date(),
//     amount: 0,
//   });

//   res.status(200).json({ fulfillmentText: `¡Agregué ${item} a tu lista!` });
// }
// /////// hasta aqui funciona con postman 18-09-25 04:19h

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Solo POST permitido" });

  try {
    let itemParam = req.body.queryResult?.parameters?.item;
    if (!itemParam || itemParam.length === 0) {
      return res.status(400).json({ fulfillmentText: "No se recibió ningún item." });
    }

    // Dialogflow envía array, tomamos el primero
    const item = Array.isArray(itemParam) ? itemParam[0] : itemParam;

    // Guardar en Firestore
    await db.collection("dataItemsMarketList2").add({
      name: item.toLowerCase(),
      tags: "compras",
      isDone: false,
      create_at: new Date(),
      amount: 0,
    });

    res.status(200).json({
      fulfillmentText: `¡Agregué "${item}" a tu lista de compras!`,
      source: "vercel-webhook",
    });

  } catch (err) {
    console.error("Error en el webhook:", err);
    res.status(500).json({ fulfillmentText: "Ocurrió un error interno." });
  }
}
