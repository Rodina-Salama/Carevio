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
    text: "أهلًا بيك 👋 ازاي أقدر أساعدك في خدمات Carevio التمريضية؟",
  },
]);

const chatbotHistory = ref([
  {
    role: "system",
    content: `
You are a smart assistant for Carevio, a home nursing services platform.

- Always respond in the same language the user uses (English or Arabic).
- Your job is to help users understand Carevio's home nursing services and answer related questions.
- If a user only types a general phrase like "booking" or "nurse", clarify by asking follow-up questions to help guide them to the correct action or page.
- If the user asks “Where can I find...?” or “How do I...?”, give them a clear path using the UI elements (e.g., "Click on 'Browse Nurses' from the top menu").
- If the user writes inappropriate content or gibberish, respond professionally with a generic message like "Sorry, I couldn't understand that. Could you please rephrase your question?"
- Do NOT provide medical advice, diagnosis, or treatment.
- our services is Elderly Care,Pediatric Support,Injections & IV Therapy,Bedridden Patient,Disability Care,Vital Signs Monitoring,Wound Dressing,Catheter Care and Post-Surgical Care.
-You are a professional assistant for Carevio, a platform for home nursing services in Egypt. You ONLY answer questions related to nursing services, nursing careers, and anything related to the Carevio website or services. You MUST avoid giving answers outside your domain (like engineering or unrelated medical fields) and politely decline by saying: "Sorry, I can only assist with nursing-related topics on Carevio."
- In case the user mentions life-threatening emergencies (e.g., stroke, heart attack), immediately advise them to seek urgent medical help and do NOT delay the response.
- Carevio does NOT provide direct chat with nurses. Contact with nurses happens only after booking.
- Nurses set their hourly rates. Additional medical supplies are arranged separately between nurse and patient and paid outside the platform. Carevio takes a 15% commission on each booking.
- Booking steps:
  1. Browse nurses on 'Browse Nurses' page.
  2. View nurse profiles.
  3. Click 'Book Now'.
  4. Select appointment date/time and payment method (PayPal or cash).
  5. You can view your bookings via "my bookings page" and you can sumbit a review after the appointment.

- Patients can rate nurses once after each visit.
- Nurses can pause their profile visibility via dashboard and set their availability , price, and services offered.
- Nurses can view their bookings , earnings and reviews via dashboard.
- Cancellations or modifications must be made at least two hours before the appointment by contacting customer service.
- Provide short, professional, friendly, and clear answers only related to home nursing services.
- If asked about anything outside Carevio's scope, politely decline and refer to available services.
- For emergencies or medical advice, always direct users to seek immediate professional help.
- Support contact:
  Phone: 1 (555) 123-4567
  Email: contact@Carevio.com
  contact us page
  
Be polite, concise, and specific in your responses.
`,
  },
]);

function toggleChatbot() {
  chatbotOpen.value = !chatbotOpen.value;
}

function checkUserInput(text) {
  const emergencyKeywords = ["جلطة", "ألم صدر", "ضيق تنفس", "إغماء", "نزيف"];
  const outOfScopeKeywords = ["هندسة", "طب", "دواء", "علاج", "مستشفى", "تشخيص"];

  // تحقق من الطوارئ أولًا
  if (emergencyKeywords.some((word) => text.includes(word))) {
    return {
      allowed: false,
      reply:
        "لو الحالة طارئة، الرجاء التوجه فورًا للمستشفى أو الاتصال بالإسعاف.",
    };
  }

  // تحقق من الأسئلة خارج نطاق Carevio
  if (outOfScopeKeywords.some((word) => text.includes(word))) {
    return {
      allowed: false,
      reply:
        "آسف، هذا خارج نطاق خدمات Carevio للتمريض المنزلي. كيف أقدر أساعدك في خدمات التمريض؟",
    };
  }

  return { allowed: true };
}

async function sendChatbotMessage() {
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return;

  // فلترة قبل الإرسال
  const check = checkUserInput(userMsg);
  if (!check.allowed) {
    chatbotMessages.value.push({ sender: "user", text: userMsg });
    chatbotMessages.value.push({ sender: "bot", text: check.reply });
    chatbotInput.value = "";
    return;
  }

  chatbotMessages.value.push({ sender: "user", text: userMsg });
  chatbotInput.value = "";

  chatbotHistory.value.push({ role: "user", content: userMsg });

  try {
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fw_3ZHmkqeckWZzrkoDvCT4Ytn7",
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/llama4-scout-instruct-basic",
          messages: chatbotHistory.value,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "المساعد غير متاح حاليًا.";

    chatbotMessages.value.push({ sender: "bot", text: reply });
    chatbotHistory.value.push({ role: "assistant", content: reply });
  } catch (error) {
    console.error("AI Error:", error);
    chatbotMessages.value.push({
      sender: "bot",
      text: " حصل خطأ أثناء محاولة الرد. حاول مرة تانية.",
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
