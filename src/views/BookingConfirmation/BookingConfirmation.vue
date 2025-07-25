<template>
  <div class="booking-confirmation">
    <div class="back-button" @click="$router.back()">← Back</div>

    <h1 class="title">Booking Confirmation</h1>
    <p class="subtitle">
      Please review your booking details below before confirming.
    </p>

    <div class="details-box">
      <div class="detail">
        <strong>Date</strong><span>{{ booking.date }}</span>
      </div>
      <div class="detail">
        <strong>Time</strong><span>{{ booking.time }}</span>
      </div>
      <div class="detail">
        <strong>Nurse</strong><span>{{ booking.nurse }}</span>
      </div>
      <div class="detail">
        <strong>Service</strong><span>{{ booking.service }}</span>
      </div>
      <div class="detail">
        <strong>Address</strong><span>{{ booking.address }}</span>
      </div>
      <div class="detail">
        <strong>Total Cost</strong><span>{{ booking.total }} EGP</span>
      </div>

      <div class="payment-methods">
        <label @click="handlePaypalClick">
          <input type="radio" value="paypal" v-model="paymentMethod" />
          <img :src="paypalImg" alt="PayPal" />
          PayPal
        </label>

        <label>
          <input type="radio" value="cash" v-model="paymentMethod" />
          <img :src="cashImg" alt="Cash" />
          Cash
        </label>
      </div>

      <div class="actions">
        <button class="cancel" @click="$router.back()">Cancel</button>
        <button class="confirm" @click="handleConfirm">Confirm Booking</button>
      </div>
    </div>
  </div>
  <h2 class="success-title">Booking Confirmed!</h2>
  <div v-if="showSuccessMessage" class="success-message-container">
    <div class="success-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#2ecc71"
        width="64px"
        height="64px"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </div>
    <p class="success-text">
      We've sent your booking confirmation via email. Please check your inbox.
    </p>
    <p class="success-note">
      Redirecting to your bookings in {{ countdown }} seconds...
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import paypalImg from "@/assets/paypal.png";
import cashImg from "@/assets/cash.png";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

const router = useRouter();

const booking = ref({
  date: "",
  time: "",
  nurse: "",
  service: "",
  address: "",
  total: "",
});

const paymentMethod = ref("");
const showSuccessMessage = ref(false);
const countdown = ref(5);
let countdownInterval = null;

onMounted(() => {
  const storedBooking = JSON.parse(localStorage.getItem("bookingData"));
  if (storedBooking) {
    booking.value = {
      date: storedBooking.date,
      time: `${storedBooking.from} - ${storedBooking.to}`,
      nurse: storedBooking.nurseName,
      service: storedBooking.service,
      address: storedBooking.address,
      total: storedBooking.price,
      notes: storedBooking.notes || "",
    };
  }
});

onBeforeUnmount(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

const handlePaypalClick = () => {
  paymentMethod.value = "paypal";
  const width = 500;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    "https://www.paypal.com/signin?returnUri=%2Fmyaccount%2Fsummary",
    "PayPalLogin",
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
  );
};

const saveBooking = async () => {
  const storedBooking = JSON.parse(localStorage.getItem("bookingData"));
  try {
    await addDoc(collection(db, "bookings"), {
      ...storedBooking,
      paymentMethod: paymentMethod.value,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Booking save error:", err);
    alert("Failed to save booking.");
  }
};

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval);
      router.push("/my-bookings");
    }
  }, 1000);
};

const handleConfirm = async () => {
  if (!paymentMethod.value) {
    alert("Please choose a payment method.");
    return;
  }

  await saveBooking();
  localStorage.removeItem("bookingData");
  showSuccessMessage.value = true;
  startCountdown();
};
</script>

<style scoped>
.booking-confirmation {
  padding: 40px;
  max-width: 800px;
  margin: auto;
  font-family: "Cairo", sans-serif;
}

.back-button {
  color: #19599a;
  cursor: pointer;
  font-weight: bold;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
}

.subtitle {
  font-size: 14px;
  color: gray;
}

.details-box {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.payment-methods {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.payment-methods label {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #19599a;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.payment-methods img {
  width: 24px;
  height: 24px;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.cancel {
  padding: 10px 20px;
  border: 1px solid #19599a;
  color: #19599a;
  background: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.cancel:hover {
  background-color: #19599a;
  color: white;
}

.confirm {
  background-color: #19599a;
  color: white;
  padding: 10px 25px;
  border: none;
  cursor: pointer;
}
</style>
