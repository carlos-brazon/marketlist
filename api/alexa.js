import admin from "firebase-admin";
//------------------para usar con node index.js------------------
// import dotenv from "dotenv";

// dotenv.config({ path: ".env.local" }); // fuerza la carga del archivo correcto
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }
// const db = admin.firestore();
//-----------------------------------------------------------------

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

function getIdByTypeAdd(slot) {
  return (
    slot.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.id ||
    "anonimo"
  );
}

async function addItemToFirebase(itemName, userUid, tags) {
  const docRef = db.collection("dataItemsMarketList").doc();
  await docRef.set({
    userUid,
    isDone: false,
    priority: false,
    id: docRef.id,
    name: itemName.toLowerCase(),
    tags: tags.toLowerCase(),
    create_at: new Date(),
    amount: 0,
  });
  return docRef.id;
}

function alexaResponse(res, text, endSession = false) {
  return res.status(200).json({
    version: "1.0",
    sessionAttributes: {},
    response: {
      outputSpeech: { type: "PlainText", text },
      reprompt: {
        outputSpeech: {
          type: "PlainText",
          text: "¿Quieres agregar algo más a tu lista?",
        },
      },
      shouldEndSession: endSession,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Solo POST permitido" });

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const requestType = body?.request?.type;

    if (requestType === "LaunchRequest") {
      return alexaResponse(res, "Bienvenido a Super Lista. Dime qué quieres agregar.");
    }

    if (requestType === "IntentRequest") {
      const intent = body.request?.intent;
      if (!intent) throw new Error("No hay intent en el request");

      const itemAlexa = {
        name: intent.slots?.name?.value || "producto desconocido",
        tags: intent.slots?.tags?.value || "compras",
        uid: getIdByTypeAdd(
          intent.slots?.user.value === "pon" ? intent.slots?.user : intent.slots?.usercom
        ),
      };

      if (intent.name === "AddItemIntent") {
        const dataFromFirebase = await db
          .collection("dataItemsMarketList")
          .where("userUid", "==", itemAlexa.uid)
          .where("tags", "==", itemAlexa.tags)
          .get();

        const namesFromFirebas = new Set(
          dataFromFirebase.docs.map((doc) => doc.data().name.toLowerCase().trim())
        );

        // para verificar con combina (varios items)
        if (intent.slots?.usercom?.value === "combina") {
          const arrayNamesFromAlexa = (itemAlexa.name || "").split(" ").filter(Boolean);

          let addedItem = [];
          let duplicateItem = [];

          for (const nameFromAlexa of arrayNamesFromAlexa) {
            if (namesFromFirebas.has(nameFromAlexa.toLowerCase())) {
              duplicateItem.push(nameFromAlexa);
            } else {
              await addItemToFirebase(nameFromAlexa, itemAlexa.uid, itemAlexa.tags);
              addedItem.push(nameFromAlexa);
            }
          }

          if (addedItem.length > 0 && duplicateItem.length > 0) {
            return alexaResponse(res, `Agregué ${addedItem.join(", ")}. Pero ${duplicateItem.join(", ")} ya estaba en tu lista de ${itemAlexa.tags}.`);
          } else if (addedItem.length > 0) {
            return alexaResponse(res, `¡Agregué ${addedItem.join(", ")} a tu lista de ${itemAlexa.tags}!`);
          } else {
            return alexaResponse(res, `Todos los productos ya estaban en tu lista de ${itemAlexa.tags}.`);
          }
        }
        // para verificar con pon (item individual)
        if (namesFromFirebas.has(itemAlexa.name.toLowerCase())) {
          return alexaResponse(res, `"${itemAlexa.name}" ya se encuentra en tu lista de ${itemAlexa.tags}`);
        }

        await addItemToFirebase(itemAlexa.name, itemAlexa.uid, itemAlexa.tags);
        return alexaResponse(res, `¡Agregué "${itemAlexa.name}" a tu lista de ${itemAlexa.tags}!`);
      }

      return alexaResponse(res, "No reconozco ese intento.");
    }
    return alexaResponse(res, "No entendí tu solicitud.");
  } catch (err) {
    console.error("Error en handler Alexa:", err);
    return alexaResponse(res, "Ocurrió un error interno.", true);
  }
}
