import admin from "firebase-admin";

// Inicializar Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST permitido" });
  }

  try {
    // Tomar el item desde Dialogflow
    let item = req.body.queryResult?.parameters;

    // Validar que haya un item
    if (!item || (Array.isArray(item) && item.length === 0)) {
      return res
        .status(400)
        .json({ fulfillmentText: "No se recibió ningún item." });
    }

    // Si viene en array, tomar el primer elemento
    item = Array.isArray(item) ? item[0] : item;

    // Guardar en Firestore
    const docRef = db.collection("dataItemsMarketList2").doc(); // genera un ID
    const docId = docRef.id;

    await docRef.set({
      userUid: item.uid,
      isDone: false,
      priority: false,
      id: docId,
      name: item.name.toLowerCase(),
      tags: item.tags.toLowerCase(),
      create_at: new Date(),
      amount: 0,
    });

    // Respuesta para Dialogflow
    res.status(200).json({
      fulfillmentText: `¡Agregué "${item}" a tu lista de compras!`,
      source: "vercel-webhook",
    });
  } catch (err) {
    console.error("Error en el webhook:", err);
    res.status(500).json({ fulfillmentText: "Ocurrió un error interno." });
  }
}
