<!-- src/views/nurse/NurseBookingDetails.vue -->
<template>
  <div class="booking-details">
    <h1>Booking Details</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="booking">
      <ul>
        <li><strong>Patient Name:</strong> {{ booking.userName }}</li>
        <li><strong>Phone:</strong> {{ booking.userPhone }}</li>
        <li><strong>Date:</strong> {{ booking.date }}</li>
        <li><strong>Time:</strong> {{ booking.from }} - {{ booking.to }}</li>
        <li><strong>Service:</strong> {{ booking.service }}</li>
        <li><strong>Address:</strong> {{ booking.address }}</li>
        <li><strong>Notes:</strong> {{ booking.notes || "No notes" }}</li>
        <li><strong>Payment Method:</strong> {{ booking.paymentMethod }}</li>
        <li><strong>Price:</strong> {{ booking.price }} EGP</li>
        <li>
          <strong>Created At:</strong> {{ formatTimestamp(booking.createdAt) }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Booking not found.</p>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const bookingId = route.params.id;
    const booking = ref(null);
    const loading = ref(true);

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "N/A";
      const date = timestamp.toDate();
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const fetchBooking = async () => {
      const docRef = doc(db, "bookings", bookingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        booking.value = docSnap.data();
      }
      loading.value = false;
    };

    onMounted(fetchBooking);

    return {
      booking,
      loading,
      formatTimestamp,
    };
  },
};
</script>

<style scoped>
.booking-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.booking-details ul {
  list-style: none;
  padding: 0;
}
.booking-details li {
  margin-bottom: 0.8rem;
  font-size: 1rem;
}
.booking-details strong {
  display: inline-block;
  width: 150px;
}
</style>
