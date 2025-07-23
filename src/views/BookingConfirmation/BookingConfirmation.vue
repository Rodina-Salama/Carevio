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
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import paypalImg from "@/assets/paypal.png";
import cashImg from "@/assets/cash.png";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

const router = useRouter();

const booking = ref({
  date: "July 24, 2025",
  time: "10:00 AM",
  nurse: "Noha Ahmed",
  service: "Home Nursing Care",
  address: "14th El Madi street",
  total: 200,
});

const paymentMethod = ref("");

const paypalLink =
  "https://www.paypal.com/signin?returnUri=%2Fmyaccount%2Fsummary";

const handlePaypalClick = () => {
  paymentMethod.value = "paypal";

  const width = 500;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(
    paypalLink,
    "PayPalLogin",
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
  );
};

const handleConfirm = async () => {
  if (!paymentMethod.value) {
    alert("Please choose a payment method.");
    return;
  }

  await saveBooking(paymentMethod.value);
  alert("Booking confirmed!");
  router.push("/thank-you");
};

const saveBooking = async (method) => {
  try {
    await addDoc(collection(db, "bookings"), {
      ...booking.value,
      paymentMethod: method,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Booking save error:", err);
    alert("Failed to save booking.");
  }
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
