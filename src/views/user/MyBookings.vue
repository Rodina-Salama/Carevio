<template>
  <div class="my-bookings-page">
    <h1>My Bookings</h1>

    <div v-if="loading">Loading bookings...</div>

    <div v-else>
      <!-- Active Bookings -->
      <h2>Active Bookings</h2>
      <div v-if="activeBookings.length === 0">No active bookings</div>
      <div
        v-for="booking in activeBookings"
        :key="booking.id"
        class="booking-card"
      >
        <div class="booking-info">
          <p class="date">
            <strong>{{ booking.date }}</strong> — {{ booking.from }} to
            {{ booking.to }}
          </p>
          <p><strong>Service:</strong> {{ booking.service }}</p>
          <p><strong>Nurse:</strong> {{ booking.nurseName }}</p>
          <p><strong>Price:</strong> EGP {{ booking.price }}</p>
        </div>
      </div>

      <!-- Past Bookings -->
      <h2>Past Bookings</h2>
      <div v-if="pastBookings.length === 0">No past bookings</div>
      <div
        v-for="booking in pastBookings"
        :key="booking.id"
        class="booking-card"
      >
        <div class="booking-info">
          <p class="date">
            <strong>{{ booking.date }}</strong> — {{ booking.from }} to
            {{ booking.to }}
          </p>
          <p><strong>Service:</strong> {{ booking.service }}</p>
          <p><strong>Nurse:</strong> {{ booking.nurseName }}</p>
          <p><strong>Price:</strong> EGP {{ booking.price }}</p>
        </div>

        <div v-if="!booking.review" class="review-box">
          <button @click="openModal(booking)">Add Review</button>
        </div>
        <div v-else class="submitted-review">
          <p><strong>Your Review:</strong> {{ booking.review }}</p>
          <p><strong>Rating:</strong> {{ booking.rating }} ★</p>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <button class="custom-close-btn" @click="closeModal">×</button>
        <h3>Rate your experience</h3>

        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ active: n <= rating }"
            @click="rating = n"
            >★</span
          >
        </div>

        <textarea
          v-model="comment"
          placeholder="Write your review..."
        ></textarea>

        <button @click="submitReview">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUserStore } from "@/stores/userStore";

const bookings = ref([]);
const activeBookings = ref([]);
const pastBookings = ref([]);
const loading = ref(true);

const userStore = useUserStore();
const userId = userStore.firebaseUser?.uid;

const today = new Date().toISOString().split("T")[0];

const fetchBookings = async () => {
  loading.value = true;

  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  bookings.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  activeBookings.value = bookings.value.filter((b) => b.date >= today);
  pastBookings.value = bookings.value.filter((b) => b.date < today);

  loading.value = false;
};

// Modal states
const showModal = ref(false);
const selectedBooking = ref(null);
const rating = ref(0);
const comment = ref("");

const openModal = (booking) => {
  selectedBooking.value = booking;
  rating.value = 0;
  comment.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitReview = async () => {
  if (rating.value === 0 || !comment.value.trim()) {
    alert("Please provide a star rating and comment.");
    return;
  }

  const bookingRef = doc(db, "bookings", selectedBooking.value.id);
  await updateDoc(bookingRef, {
    review: comment.value,
    rating: rating.value,
  });

  selectedBooking.value.review = comment.value;
  selectedBooking.value.rating = rating.value;

  showModal.value = false;
  alert("Review submitted successfully!");
};

onMounted(() => {
  fetchBookings();
});
</script>

<style scoped>
.my-bookings-page {
  padding: 2rem 3rem;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  color: #222;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
}

.booking-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-info p {
  margin: 0.2rem 0;
  font-size: 0.95rem;
  color: #444;
}

.booking-info .date {
  font-weight: 500;
  color: #111;
}

button {
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1565c0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: #444;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  z-index: 1000;

  width: 32px; /* مثلا */
  height: 32px; /* مثلا */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.stars {
  text-align: center;
  margin-bottom: 1rem;
}

.star {
  font-size: 1.8rem;
  cursor: pointer;
  color: #ccc;
  margin: 0 0.2rem;
  transition: color 0.3s;
}

.star.active {
  color: #ffc107;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* Modal box */
.modal-box {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.custom-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: #444;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  z-index: 1000;
}

/* Modal title */
.modal-box h2 {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
}

/* Star rating */
.star-rating {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  font-size: 1.6rem;
  color: #ffd700;
  cursor: pointer;
}

/* Comment textarea */
.modal-box textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.6rem;
  resize: none;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

/* Submit button (inherits global style) */
.modal-box button {
  width: 100%;
}
</style>
