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
  return (
    slot?.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]?.value?.id ||
    "anonimo"
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Solo POST permitido" });

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
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
        uid: safeSlotId(intent.slots?.user),
      };

      if (intent.name === "AddItemIntent") {
        const dataFromFirebase = await db
          .collection("dataItemsMarketList2")
          .where("userUid", "==", item.uid)
          .get();

        let dataUser = [];
        dataFromFirebase.forEach((item) => {
          dataUser.push(item.data());
        });

        const arrayItemFilterByTags = dataUser.filter(
          (itemUser) => itemUser.tags === item.tags
        );

        const itemFound = arrayItemFilterByTags.find(
          (element) => element.name.toLowerCase() === item.name.toLowerCase()
        ); // aqui verifico si el tiem nuevo existe dentro de ese array de etiquetas

        if (itemFound) {
          responseText = `¡"${item.name}" ya se encuentra tu lista de ${item.tags}!`;
          return;
        }
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
          outputSpeech: {
            type: "PlainText",
            text: "¿Quieres agregar algo más a tu lista?",
          },
        },
        shouldEndSession: false,
      },
    });
  } catch (err) {
    console.error("Error en handler Alexa:", err);
    return res.status(200).json({
      version: "1.0",
      sessionAttributes: {},
      response: {
        outputSpeech: { type: "PlainText", text: "Ocurrió un error interno." },
        shouldEndSession: true,
      },
    });
  }
}
