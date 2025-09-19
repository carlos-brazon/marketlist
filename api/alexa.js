// import admin from "firebase-admin";

import { db } from "../src/utils/firebase";

// // Inicializar Firebase Admin
// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Solo POST permitido" });
//   }

//   try {
//     // Tomar el item desde Dialogflow
//     let item = req.body.queryResult?.parameters;

//     // Validar que haya un item
//     if (!item || (Array.isArray(item) && item.length === 0)) {
//       return res
//         .status(400)
//         .json({ fulfillmentText: "No se recibió ningún item." });
//     }

//     // Si viene en array, tomar el primer elemento
//     item = Array.isArray(item) ? item[0] : item;

//     // Guardar en Firestore
//     const docRef = db.collection("dataItemsMarketList2").doc(); // genera un ID
//     const docId = docRef.id;

//     await docRef.set({
//       userUid: item.uid,
//       isDone: false,
//       priority: false,
//       id: docId,
//       name: item.name.toLowerCase(),
//       tags: item.tags.toLowerCase(),
//       create_at: new Date(),
//       amount: 0,
//     });

//     // Respuesta para Dialogflow
//     res.status(200).json({
//       fulfillmentText: `¡Agregué "${item}" a tu lista de compras!`,
//       source: "vercel-webhook",
//     });
//   } catch (err) {
//     console.error("Error en el webhook:", err);
//     res.status(500).json({ fulfillmentText: "Ocurrió un error interno." });
//   }
// }
// hasta aqui funciona con dialogflow 18/09/2025

// import admin from "firebase-admin";

// // Inicializar Firebase Admin
// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Solo POST permitido" });
//   }

//   try {
//     let item;

//     // Detectar si viene de Alexa
//     if (req.body.response?.directives[0]?.updatedIntent?.slots) {
//       const slots = req.body.response?.directives[0]?.updatedIntent?.slots;

//       // Solo tomamos el name que el usuario dijo
//       item = {
//         name: slots.name?.value || "",
//       };

//       // Si Alexa está delegando, solo devuelve la directiva para que siga llenando slots
//       if (
//         req.body.body?.response?.directives?.[0]?.type === "Dialog.Delegate"
//       ) {
//         return res.status(200).json(req.body.body);
//       }
//     } else {
//       return res
//         .status(400)
//         .json({ fulfillmentText: "No se recibió ningún item." });
//     }

//     // Guardar en Firestore con valores manuales
//     const docRef = db.collection("dataItemsMarketList2").doc();
//     const docId = docRef.id;

//     await docRef.set({
//       userUid: "pdfvkdsnv kgfb9546y999", // valor manual
//       isDone: false,
//       priority: false,
//       id: docId,
//       name: item.name.toLowerCase(),
//       tags: "compras", // valor manual
//       create_at: new Date(),
//       amount: 0,
//     });

//     // Respuesta compatible con Alexa
//     const responseText = `¡Agregué "${item.name}" a tu lista de compras!`;

//     return res.status(200).json({
//       version: "1.0",
//       response: {
//         outputSpeech: {
//           type: "PlainText",
//           text: responseText,
//         },
//         shouldEndSession: true,
//       },
//     });
//   } catch (err) {
//     console.error("Error en el webhook:", err);
//     res.status(500).json({ fulfillmentText: "Ocurrió un error interno." });
//   }
// }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST permitido" });
  }

  try {
    const requestType = req.body.request?.type;
    let responseText = "";

    // Caso 1: LaunchRequest
    if (requestType === "LaunchRequest") {
      responseText =
        "Bienvenido a tu lista de compras. Dime qué quieres agregar.";
    }

    // Caso 2: IntentRequest
    else if (requestType === "IntentRequest") {
      const intent = req.body.request.intent;

      if (intent.name === "AddItemIntent") {
        const itemName = intent.slots?.name?.value || "un producto";
        responseText = `¡Agregué "${itemName}" a tu lista de compras!`;

        // Guardar en Firestore
        const docRef = db.collection("dataItemsMarketList2").doc();
        await docRef.set({
          userUid: 90909090, // lo puedes cambiar por el userId real
          isDone: false,
          priority: false,
          id: docRef.id,
          name: itemName.toLowerCase(),
          tags: "compras",
          create_at: new Date(),
          amount: 0,
        });
      } else {
        responseText = "No entendí qué producto quieres agregar.";
      }
    }

    // Caso 3: Otro tipo de request
    else {
      responseText = "Lo siento, no entendí tu solicitud.";
    }

    // 🔑 Respuesta a Alexa
    return res.status(200).json({
      version: "1.0",
      sessionAttributes: {},
      response: {
        outputSpeech: {
          type: "PlainText",
          text: responseText,
        },
        reprompt: {
          outputSpeech: {
            type: "PlainText",
            text: "¿Quieres agregar algo más a tu lista?",
          },
        },
        shouldEndSession: false,
      },
    });
  } catch (err) {
    console.error("Error en el webhook:", err);
    res.status(500).json({
      version: "1.0",
      sessionAttributes: {},
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Ocurrió un error interno.",
        },
        shouldEndSession: true,
      },
    });
  }
}
