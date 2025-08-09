// --- Snarky + Chaotic Chatbot ---
// UI elements
const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

// Add chat bubble
function addBubble(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = 'bubble ' + (who === 'me' ? 'me' : 'bot');
  el.innerHTML = text; // allow emojis
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

// Detect distress (basic safety guard)
function userShowsDistress(s) {
  const distressWords = [
    'sad', 'depress', 'suicid', 'hopeless', 'alone',
    'kill myself', 'cant go on', 'worthless'
  ];
  s = s.toLowerCase();
  return distressWords.some(w => s.includes(w));
}

// Fun random emoji
function randomEmoji() {
  const emojis = ["😂", "🙃", "🦄", "🍕", "🔥", "🤡", "🥴", "👀", "💩", "😜", "🪩", "🤯"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

// Predefined chaotic replies
const funnyReplies = [
  "Oh sure, let me just consult my crystal ball 🔮... yep, still no idea.",
  "Wow, deep question... have you tried asking your toaster?",
  "Hold up, I need coffee before I answer that ☕.",
  "That’s above my pay grade, ask Google… or your cat.",
  "Oh absolutely... if we were in an alternate universe 🌌.",
  "Bruh. Just… bruh.",
  "Plot twist: I’m actually a potato 🥔.",
  "Do you want the short answer or the overcomplicated nonsense one?",
  "If I answer this, do I get pizza?",
  "You’re speaking to an AI, not Gandalf."
];

// Get response from backend AI API
async function getResponse(text) {
  // Detect distress → supportive reply
  if (userShowsDistress(text)) {
    return "I’m hearing some distress. If you’re feeling very low, please reach out to someone you trust or a helpline ❤️. You matter.";
  }

  try {
    // Try API first
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Answer in a ridiculous, unserious, sarcastic tone with random jokes: ${text}`
      })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    if (data.reply) {
      // Mix in emoji chaos
      return `${data.reply} ${randomEmoji()} ${randomEmoji()}`;
    }
  } catch (err) {
    console.error("Error fetching AI reply:", err);
  }

  // If API fails → use random local joke
  const randomLocalReply = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];
  return `${randomLocalReply} ${randomEmoji()} ${randomEmoji()}`;
}

// Send message from user
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, 'me');
  input.value = '';

  // Show "typing..."
  const typingEl = document.createElement('div');
  typingEl.className = 'bubble bot';
  typingEl.textContent = "SnarkBot is thinking...";
  chat.appendChild(typingEl);
  chat.scrollTop = chat.scrollHeight;

  // Fetch AI reply
  getResponse(text).then(reply => {
    chat.removeChild(typingEl);
    addBubble(reply, 'bot');
  });
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});
clearBtn.addEventListener('click', () => {
  chat.innerHTML = '';
  addBubble("Say hi to Chaotic GokuBot! 🤪", 'bot');
});

// Initial greeting
addBubble("Say hi to Chaotic GokuBot! 🤪", 'bot');