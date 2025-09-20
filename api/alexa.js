import admin from "firebase-admin";

// Inicializar Firebase Admin solo si no hay apps activas
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

function safeSlotId(slot) {
  return slot?.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.id || "anonimo";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Solo POST permitido" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const requestType = body?.request?.type;
    let responseText = "No entendí tu solicitud.";

    if (requestType === "LaunchRequest") {
      responseText = "Bienvenido a Super Lista. Dime qué quieres agregar.";
    } else if (requestType === "IntentRequest") {
      const intent = body.request?.intent;
      if (!intent) throw new Error("No hay intent en el request");

      const item = {
        name: intent.slots?.name?.value || "producto desconocido",
        tags: intent.slots?.tags?.value || "general",
        uid: safeSlotId(intent.slots?.user)
      };

      if (intent.name === "AddItemIntent") {
        const docRef = db.collection("dataItemsMarketList2").doc();
        await docRef.set({
          userUid: item.uid,
          isDone: false,
          priority: false,
          id: docRef.id,
          name: item.name.toLowerCase(),
          tags: item.tags.toLowerCase(),
          create_at: new Date(),
          amount: 0,
        });

        responseText = `¡Agregué "${item.name}" a tu lista de ${item.tags}!`;
      } else {
        responseText = "No reconozco ese intento.";
      }
    }

    return res.status(200).json({
      version: "1.0",
      sessionAttributes: {},
      response: {
        outputSpeech: { type: "PlainText", text: responseText },
        reprompt: {
          outputSpeech: { type: "PlainText", text: "¿Quieres agregar algo más a tu lista?" }
        },
        shouldEndSession: false,
      }
    });

  } catch (err) {
    console.error("Error en handler Alexa:", err);
    return res.status(200).json({
      version: "1.0",
      sessionAttributes: {},
      response: {
        outputSpeech: { type: "PlainText", text: "Ocurrió un error interno." },
        shouldEndSession: true,
      }
    });
  }
}


// // api/alexa.js
// import { db } from "../src/utils/firebaseNode.js"; // Firestore modular
// import { collection, doc, setDoc } from "firebase/firestore";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(405).json({ error: "Solo POST permitido" });
//   }

//   try {
//     const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
//     const requestType = body?.request?.type;
//     let responseText = "No entendí tu solicitud.";

//     if (requestType === "LaunchRequest") {
//       // Mensaje de bienvenida
//       responseText = "Bienvenido a Super Lista. Dime qué quieres agregar.";
//     } 
//     else if (requestType === "IntentRequest") {
//       const intent = body.request?.intent;
//       if (!intent) throw new Error("No hay intent en el request");

//       // Extraer info de los slots
//       const itemName = intent.slots?.name?.value || "producto desconocido";
//       const itemTags = intent.slots?.tags?.value || "general";
//       const itemUid =
//         intent.slots?.user?.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.id ||
//         "anonimo";

//       if (intent.name === "AddItemIntent") {
    
//           // Guardar en Firestore
//           const newDoc = doc(collection(db, "dataItemsMarketList2"));
//           await setDoc(newDoc, {
//             userUid: itemUid,
//             name: itemName.toLowerCase(),
//             tags: itemTags.toLowerCase(),
//             id: newDoc.id,
//             isDone: false,
//             priority: false,
//             create_at: new Date(),
//             amount: 0,
//           });
//           responseText = `¡Agregué "${itemName}" a tu lista de ${itemTags}!`;
//       } else {
//         responseText = "No reconozco ese intento.";
//       }
//     }

//     // Responder a Alexa
//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({
//       version: "1.0",
//       sessionAttributes: {},
//       response: {
//         outputSpeech: { type: "PlainText", text: responseText },
//         reprompt: {
//           outputSpeech: {
//             type: "PlainText",
//             text: "¿Quieres agregar algo más a tu lista?",
//           },
//         },
//         shouldEndSession: false,
//       },
//     });
//   } catch (err) {
//     console.error("Error en handler Alexa:", err);
//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({
//       version: "1.0",
//       sessionAttributes: {},
//       response: {
//         outputSpeech: { type: "PlainText", text: "Ocurrió un error interno." },
//         shouldEndSession: true,
//       },
//     });
//   }
// }

// import admin from "firebase-admin";

// // Inicializar Firebase Admin solo si no hay apps activas
// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.setHeader("Content-Type", "application/json");
//     return res.status(405).json({ error: "Solo POST permitido" });
//   }

//   try {
//     const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
//     const requestType = body?.request?.type;
//     let responseText = "No entendí tu solicitud.";

//     if (requestType === "LaunchRequest") {
//       // Mensaje de bienvenida
//       responseText = "Bienvenido a Super Lista. Dime qué quieres agregar.";
//     } 
//     else if (requestType === "IntentRequest") {
//       const intent = body.request?.intent;
//       if (!intent) throw new Error("No hay intent en el request");

//       const item = {
//         name: intent.slots?.name?.value || "producto desconocido",
//         tags: intent.slots?.tags?.value || "",
//         uid: intent.slots?.user?.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.id || "anonimo"
//       };

//       if (intent.name === "AddItemIntent") {
//         responseText = `¡Agregué "${item.name}" a tu lista de ${item.tags}!`;

//         // Guardar en Firestore
//         const docRef = db.collection("dataItemsMarketList2").doc();
//         await docRef.set({
//           userUid: item.uid,
//           isDone: false,
//           priority: false,
//           id: docRef.id,
//           name: item.name.toLowerCase(),
//           tags: item.tags.toLowerCase(),
//           create_at: new Date(),
//           amount: 0,
//         });
//       } else {
//         responseText = "No reconozco ese intento.";
//       }
//     }

//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({
//       version: "1.0",
//       sessionAttributes: {},
//       response: {
//         outputSpeech: { type: "PlainText", text: responseText },
//         reprompt: {
//           outputSpeech: {
//             type: "PlainText",
//             text: "¿Quieres agregar algo más a tu lista?",
//           },
//         },
//         shouldEndSession: false,
//       },
//     });

//   } catch (err) {
//     console.error("Error en handler Alexa:", err);
//     res.setHeader("Content-Type", "application/json");
//     return res.status(200).json({
//       version: "1.0",
//       sessionAttributes: {},
//       response: {
//         outputSpeech: { type: "PlainText", text: "Ocurrió un error interno." },
//         shouldEndSession: true,
//       },
//     });
//   }
// }
