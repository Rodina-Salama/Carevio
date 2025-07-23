<template>
  <div>
    <button class="chatbot-toggle" @click="toggleChatbot">💬</button>

    <div v-if="chatbotOpen" class="chatbot-container">
      <div class="chatbot-header">Carevio Assistant</div>
      <div class="chatbot-messages">
        <div
          v-for="(msg, index) in chatbotMessages"
          :key="index"
          :class="['chatbot-message', msg.sender]"
        >
          {{ msg.text }}
        </div>
      </div>
      <div class="chatbot-input">
        <input
          type="text"
          v-model="chatbotInput"
          @keyup.enter="sendChatbotMessage"
          placeholder="Type your message..."
        />
        <button @click="sendChatbotMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const chatbotOpen = ref(false);
const chatbotInput = ref("");
const chatbotMessages = ref([
  {
    sender: "bot",
    text: "Hi! 👋 How can I help you with our nursing services today?",
  },
]);

const chatbotQA = [
  {
    q: ["elderly care", "old people", "senior", "aged"],
    a: "We offer Elderly Care services to support seniors at home with comfort and safety.",
  },
  {
    q: ["pediatric", "children", "kids", "child"],
    a: "Our Pediatric Support provides specialized care for children in a familiar setting.",
  },
  {
    q: ["injection", "iv", "therapy", "fluids"],
    a: "We provide professional Injections & IV Therapy at home, ensuring safety and efficacy.",
  },
  {
    q: ["bedridden", "bed", "patient", "immobile"],
    a: "Our nurses assist Bedridden Patients with comprehensive and compassionate care.",
  },
  {
    q: ["price", "cost", "how much", "fee", "egp", "pricing"],
    a: "Our services start from 150 EGP. Pricing depends on your needs.",
  },
  {
    q: ["book", "booking", "reserve", "how to book", "appointment"],
    a: "You can book a nurse by using our website's search and booking form, or contacting us directly.",
  },
  {
    q: [
      "working hours",
      "open",
      "close",
      "when",
      "time",
      "hours",
      "home visit",
      "visit",
    ],
    a: "We offer home visits every day, with flexible hours to suit your needs.",
  },
  {
    q: ["service", "what services", "nursing", "care"],
    a: "Our main services: Elderly Care, Pediatric Support, Injections & IV Therapy, Bedridden Patient.",
  },
];

function toggleChatbot() {
  chatbotOpen.value = !chatbotOpen.value;
}

function sendChatbotMessage() {
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return;
  chatbotMessages.value.push({ sender: "user", text: userMsg });
  chatbotInput.value = "";

  const lowerMsg = userMsg.toLowerCase();
  let found = false;

  for (const qa of chatbotQA) {
    if (qa.q.some((q) => lowerMsg.includes(q))) {
      chatbotMessages.value.push({ sender: "bot", text: qa.a });
      found = true;
      break;
    }
  }

  if (!found) {
    chatbotMessages.value.push({
      sender: "bot",
      text: "I'm here to help with our nursing services only 😊",
    });
  }
}
</script>

<style scoped>
.chatbot-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 1000;
}

.chatbot-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

.chatbot-header {
  background-color: #19599a;
  color: white;
  padding: 12px 16px;
  font-weight: bold;
  font-size: 16px;
}

.chatbot-messages {
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chatbot-message {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
  word-wrap: break-word;
}

.chatbot-message.user {
  align-self: flex-end;
  background-color: #19599a;
  color: white;
}

.chatbot-message.bot {
  align-self: flex-start;
  background-color: #f0f0f0;
  color: #333;
}

.chatbot-input {
  display: flex;
  border-top: 1px solid #ccc;
}
.chatbot-input input {
  flex: 1;
  border: none;
  padding: 10px;
  outline: none;
}

.chatbot-input button {
  background-color: #19599a;
  color: white;
  border: none;
  padding: 10px 14px;
  cursor: pointer;
}
</style>
