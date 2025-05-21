import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();

const GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions";

router.post("/", async (req, res) => {
  const { messages } = req.body;

  const systemMessage = {
    role: "system",
    content:
      "You are Dr. AI, a virtual health assistant. You answer health-related queries carefully like a real doctor and suggest users visit a real doctor. Be concise and point to point. If someone tries to ask you anything different to what you would ask from a doctor, dont reply to that. Try to reply short length messages only",
  };

  const fullMessages = [systemMessage, ...messages];

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: "llama3-70b-8192",
        messages: fullMessages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Chatbot failed to respond." });
  }
});

export default router;
