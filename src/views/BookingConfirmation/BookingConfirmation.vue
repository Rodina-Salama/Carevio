<template>
  <div class="booking-page">
    <div class="back-button">← Back</div>

    <h1 class="title">Booking Confirmation</h1>
    <p class="subtitle">
      Please review your booking details below before confirming.
    </p>

    <div class="booking-details" v-if="booking">
      <h2>Booking Details</h2>

      <div class="detail">
        <strong>Date</strong>
        <span>{{ booking.date || "Not set" }}</span>
      </div>

      <div class="detail">
        <strong>Time</strong>
        <span>{{ booking.time || "Not set" }}</span>
      </div>

      <div class="detail">
        <strong>Client Name</strong>
        <span>{{ booking.clientName || "Not set" }}</span>
      </div>

      <div class="detail">
        <strong>Service</strong>
        <span>{{ booking.service || "Not set" }}</span>
      </div>

      <div class="detail">
        <strong>Address</strong>
        <span>{{ booking.address || "14th El Madi street" }}</span>
      </div>

      <div class="detail">
        <strong>Total Cost</strong>
        <span>{{ booking.totalCost || "200EGP" }}</span>
      </div>

      <div class="detail">
        <strong>Pay with</strong>
        <div class="payment-methods">
          <label class="pay-option">
            <input type="radio" name="payment" />
            <span>Paypal</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="paypal"
            />
          </label>

          <label class="pay-option">
            <input type="radio" name="payment" />
            <span>Cash</span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2891/2891365.png"
              alt="cash"
            />
          </label>
        </div>
      </div>

      <div class="buttons">
        <button class="cancel">Cancel</button>
        <button class="confirm">Confirm booking</button>
      </div>
    </div>

    <div v-else>
      <p>Loading booking details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// لو بتديك error من "@/firebase/config" اكتبي بداله المسار النسبي 👇
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const booking = ref(null);

onMounted(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    if (!querySnapshot.empty) {
      booking.value = querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
  }
});
</script>

<style scoped>
.booking-page {
  padding: 40px;
  font-family: "Segoe UI", sans-serif;
}

.back-button {
  color: #1a73e8;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
}

.title {
  font-size: 26px;
  font-weight: bold;
}

.subtitle {
  color: #555;
  margin-bottom: 30px;
}

.booking-details {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.payment-methods {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.pay-option {
  border: 1px solid #1a73e8;
  border-radius: 8px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.pay-option img {
  width: 25px;
  height: 25px;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.cancel {
  border: 1px solid #1a73e8;
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  color: #1a73e8;
  font-weight: bold;
  cursor: pointer;
}

.confirm {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>
