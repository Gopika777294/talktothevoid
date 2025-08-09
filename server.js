import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Call OpenAI API (example)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${process.env.OPENAI_API_KEY}
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a playful, sarcastic chatbot. Give funny and sometimes silly answers, but never be hateful or offensive." },
          { role: "user", content: userMessage }
        ],
        max_tokens: 80,
        temperature: 1.2
      })
    });

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || "Hmm, I have no idea.";

    // Basic safety filter
    const bannedWords = ["idiot", "stupid", "kill yourself"];
    if (bannedWords.some(w => reply.toLowerCase().includes(w))) {
      reply = "Nice try, but I play safe. 😉";
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));