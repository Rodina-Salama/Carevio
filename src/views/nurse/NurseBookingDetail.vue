<!-- src/views/nurse/NurseBookingDetails.vue -->
<template>
  <div class="booking-details">
    <button class="back-btn" @click="goBack">← {{ $t("booking.back") }}</button>
    <h1>{{ $t("booking.bookingDetails") }}</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="booking">
      <ul>
        <li>
          <strong>{{ $t("booking.name") }}:</strong> {{ booking.userName }}
        </li>
        <li>
          <strong>{{ $t("booking.phone") }}:</strong> {{ booking.userPhone }}
        </li>
        <li>
          <strong>{{ $t("booking.date") }}:</strong> {{ booking.date }}
        </li>
        <li>
          <strong>{{ $t("booking.time") }}:</strong> {{ booking.from }} -
          {{ booking.to }}
        </li>
        <li>
          <strong>{{ $t("booking.service") }}:</strong>
          {{ $t(`data.specializations.${booking.service}`) }}
        </li>
        <li>
          <strong>{{ $t("booking.address") }}:</strong> {{ booking.address }}
        </li>
        <li>
          <strong>{{ $t("booking.notes") }}</strong>
          {{ booking.notes || $t("booking.noNotes") }}
        </li>
        <li>
          <strong>{{ $t("booking.payment") }}:</strong>
          {{ $t(`booking.${booking.paymentMethod}`) }}
        </li>
        <li>
          <strong>{{ $t("booking.price") }}:</strong> {{ booking.price }} EGP
        </li>
        <li>
          <strong>{{ $t("booking.createdAt") }}:</strong>
          {{ formatTimestamp(booking.createdAt) }}
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
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const router = useRouter();
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

    const goBack = () => {
      router.push(`/NurseBookings`);
    };

    onMounted(fetchBooking);

    return {
      booking,
      loading,
      formatTimestamp,
      goBack,
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

.back-btn {
  background-color: transparent;
  border: none;
  color: #19599a;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  font-weight: 600;
}
.back-btn:hover {
  text-decoration: underline;
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
