// // api/alexa.js
// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const item = req.body.request.intent.slots.item.value;
//     console.log("Item recibido:", item); // Para probar que llegó correctamente

//     // Aquí iría la lógica para guardar en Firestore
//     // Por ahora solo respondemos a Alexa
//     return res.status(200).json({
//       version: "1.0",
//       response: {
//         outputSpeech: {
//           type: "PlainText",
//           text: `Agregué ${item} a tu lista.`,
//         },
//         shouldEndSession: true,
//       },
//     });
//   }
//   res.status(405).send("Solo POST permitido");
// }

// /api/alexa.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method === "POST") {
    let item;

    // Detectamos si viene de Dialogflow
    if (req.body.queryResult) {
      item = req.body.queryResult.parameters.item;
    }
    // Detectamos si viene de Alexa
    else if (req.body.request) {
      item = req.body.request.intent.slots.item.value;
    }

    if (!item) return res.status(400).send("No se recibió item");

    console.log("Item recibido:", item);

    // Guardar en Firestore
    const itemId = db.collection("dataItemsMarketList").doc().id;
    await db.collection("dataItemsMarketList").doc(itemId).set({
      name: item.toLowerCase(),
      tags: "compras",
      isDone: false,
      create_at: new Date(),
      amount: 0,
    });

    // Respuesta según origen
    if (req.body.queryResult) {
      // Respuesta para Dialogflow
      return res.status(200).json({
        fulfillmentText: `¡Agregué ${item} a tu lista de compras!`,
      });
    } else {
      // Respuesta para Alexa
      return res.status(200).json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: `Agregué ${item} a tu lista.`,
          },
          shouldEndSession: true,
        },
      });
    }
  }

  res.status(405).send("Solo POST permitido");
}

