const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Clave de API segura desde .env
const GEMINI_API_KEY = process.env.API_KEY;

app.post("/analizar", async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log("🔎 Solicitud recibida a /analizar con prompt:", userPrompt);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ]
      })
    });

    const data = await response.json();

    // Obtenemos solo la respuesta del modelo
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No se obtuvo respuesta del modelo.";

    res.json({ respuesta: output });
  } catch (err) {
    console.error("❌ Error al llamar a Gemini:", err);
    res.status(500).json({ error: "Error al contactar con Gemini" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
