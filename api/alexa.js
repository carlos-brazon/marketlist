// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
//   });
// }
// const db = admin.firestore();

// export default async function handler(req, res) {
//   // === CORS ===
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

//   // Preflight
//   if (req.method === "OPTIONS") return res.status(200).end();

//   // POST
//   if (req.method === "POST") {
//     let item;

//     if (req.body.queryResult) {
//       item = req.body.queryResult.parameters.item;
//     } else if (req.body.request) {a
//       item = req.body.request.intent.slots.item.value;
//     }

//     if (!item) return res.status(400).json({ error: "No se recibió item" });

//     console.log("Item recibido:", item);

//     const itemId = db.collection("dataItemsMarketList").doc().id;
//     await db.collection("dataItemsMarketList").doc(itemId).set({
//       name: item.toLowerCase(),
//       tags: "compras",
//       isDone: false,
//       create_at: new Date(),
//       amount: 0,
//     });

//     if (req.body.queryResult) {
//       return res.status(200).json({
//         fulfillmentText: `¡Agregué ${item} a tu lista de compras!`,
//       });
//     } else {
//       return res.status(200).json({
//         version: "1.0",
//         response: {
//           outputSpeech: {
//             type: "PlainText",
//             text: `Agregué ${item} a tu lista.`,
//           },
//           shouldEndSession: true,
//         },
//       });
//     }
//   }

//   // Cualquier otro método
//   res.status(405).json({ error: "Solo POST permitido" });
// }
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}
const db = admin.firestore();

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      let item;

      if (req.body?.queryResult) {
        item = req.body.queryResult.parameters.item;
      } else if (req.body?.request) {
        item = req.body.request.intent.slots.item.value;
      }

      if (!item) {
        return res.status(400).json({ error: "No se recibió item" });
      }

      console.log("Item recibido:", item);

      const itemId = db.collection("dataItemsMarketList").doc().id;
      await db.collection("dataItemsMarketList").doc(itemId).set({
        name: item.toLowerCase(),
        tags: "compras",
        isDone: false,
        create_at: new Date(),
        amount: 0,
      });

      if (req.body.queryResult) {
        return res.status(200).json({
          fulfillmentText: `¡Agregué ${item} a tu lista de compras!`,
        });
      } else {
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  res.status(405).json({ error: "Solo POST permitido" });
}
