import express from "express";
import bodyParser from "body-parser";
import handler from "./api/alexa.js";

const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());

// Endpoint que Alexa va a llamar
app.post("/api/alexa", handler);

// Servidor corriendo en localhost
app.listen(3000, () => {
  console.log("Servidor Alexa corriendo en http://localhost:3000");
});
