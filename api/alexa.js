// api/alexa.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    const item = req.body.request.intent.slots.item.value;
    console.log("Item recibido:", item); // Para probar que llegó correctamente

    // Aquí iría la lógica para guardar en Firestore
    // Por ahora solo respondemos a Alexa
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
  res.status(405).send("Solo POST permitido");
}
