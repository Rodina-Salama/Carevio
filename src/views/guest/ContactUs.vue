<template>
  <section class="contact-section">
    <div class="contact-container">
      <div class="contact-header">
        <h2>{{ $t("contact.title") }}</h2>
        <p>{{ $t("contact.subtitle") }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <input
            type="text"
            v-model="form.name"
            :placeholder="$t('contact.placeholders.name')"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="email"
            v-model="form.email"
            :placeholder="$t('contact.placeholders.email')"
            required
          />
        </div>
        <div class="form-group">
          <textarea
            v-model="form.message"
            :placeholder="$t('contact.placeholders.message')"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" class="submit-btn">
          {{ $t("contact.submitButton") }}
        </button>
      </form>

      <div class="contact-infos">
        <div class="info-item">
          <span>{{ $t("contact.info.emailLabel") }}</span
          ><span>support@carevio.com</span>
        </div>
        <div class="info-item">
          <span>{{ $t("contact.info.phoneLabel") }}</span
          ><span>(555) 123-4567</span>
        </div>
      </div>
    </div>

    <!-- Success Popup -->
    <transition name="popup">
      <div v-if="showSuccess" class="success-popup">
        <div class="popup-content">
          <div class="popup-icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
          </div>
          <h3>{{ $t("contact.popup.title") }}</h3>
          <p>{{ $t("contact.popup.message") }}</p>
          <button @click="showSuccess = false" class="popup-btn">
            {{ $t("contact.popup.button") }}!
          </button>
          <div class="popup-progress"></div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// ❌ Optional: remove if not using emailjs
// import emailjs from "emailjs-com";

const form = ref({
  name: "",
  email: "",
  message: "",
});
const showSuccess = ref(false);

const handleSubmit = async () => {
  try {
    // Save to Firestore
    await addDoc(collection(db, "complains"), {
      name: form.value.name,
      email: form.value.email,
      message: form.value.message,
      createdAt: serverTimestamp(), // 🔄 timestamp
      status: "pending", // Default status
    });

    // ✅ Optional: EmailJS - Remove or configure properly if not used
    /*
    await emailjs.send(
      "your_service_id",
      "your_template_id",
      {
        to_name: form.value.name,
        to_email: form.value.email,
        message:
          "Your message has been submitted successfully. We’ll contact you soon.",
      },
      "your_user_id"
    );
    */

    // Reset and show popup
    form.value = { name: "", email: "", message: "" };
    showSuccess.value = true;
    setTimeout(() => (showSuccess.value = false), 5000);
  } catch (error) {
    console.error("Submission failed:", error);
  }
};
</script>

<style scoped>
.contact-section {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.contact-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.contact-header p {
  color: #7f8c8d;
  font-size: 1.05rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

input,
textarea {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #19599a;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  background: #19599a;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

.submit-btn:hover {
  background: #67aef5ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(52, 152, 219, 0.3);
}

.contact-infos {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-item span:first-child {
  font-weight: 600;
  color: #2c3e50;
}

/* Enhanced Popup Styles */
.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  max-width: 350px;
  width: 90%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.popup-icon {
  width: 60px;
  height: 60px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.popup-icon svg {
  width: 30px;
  height: 30px;
  fill: white;
}

.popup-content h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.popup-content p {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
}

.popup-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.popup-btn:hover {
  background: #3e8e41;
  transform: translateY(-2px);
}

.popup-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 5px;
  background: #e0e0e0;
  width: 100%;
  animation: progress 5s linear forwards;
}

.popup-progress::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: #4caf50;
  animation: progressBar 5s linear forwards;
}

/* Animations */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

@keyframes progressBar {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

@keyframes progress {
  0% {
    opacity: 1;
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
