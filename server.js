const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔐 API key protegida (NO se expone al frontend)
const API_KEY = process.env.API_KEY;


app.post("/analizar", async (req, res) => {
  const userPrompt = req.body.prompt;
console.log("Me llamaron")
  try {
    const respuesta = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "https://tusitio.com", // cambia por tu dominio
        "X-Title": "CostosQuitoDemo"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // modelo gratuito
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.7
      })
    });

    const data = await respuesta.json();
    res.json(data);
  } catch (err) {
    console.error("Error de servidor:", err);
    res.status(500).json({ error: "Error al contactar con OpenRouter" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
