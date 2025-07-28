const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Muestra los logs HTTP en consola

// Inicializa el cliente de Gemini con la API Key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Ruta para analizar el prompt
app.post("/analizar", async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log("📩 Prompt recibido:", userPrompt);

  try {
    // Asegúrate de usar un modelo válido
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Genera la respuesta
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Respuesta generada con éxito.");
    res.json({ respuesta: text });

  } catch (error) {
    console.error("❌ Error al generar contenido:", error);

    // Manejo específico de errores
    if (error.status === 429) {
      res.status(429).json({ error: "Límite de uso de la API alcanzado. Intenta nuevamente más tarde." });
    } else if (error.status === 404) {
      res.status(404).json({ error: "Modelo no encontrado. Verifica el nombre del modelo o la versión de la API." });
    } else {
      res.status(500).json({ error: "Error interno al generar contenido con Gemini." });
    }
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
