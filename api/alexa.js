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

import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Solo POST permitido");

  try {
    let item = req.body.queryResult?.parameters?.item;
    if (!item) {
      return res.status(400).json({ error: "No se recibió item" });
    }

    // Dialogflow envía array, tomamos el primero
    const item = Array.isArray(item) ? item[0] : item;

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
    });

  } catch (err) {
    console.error("Error en el webhook:", err);
    res.status(500).json({ fulfillmentText: "Ocurrió un error interno." });
  }
}
