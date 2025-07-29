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
          <p><strong>Nurse:</strong> {{ booking.nurseName }}</p>
          <p><strong>Service:</strong> {{ booking.service }}</p>

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
          <p><strong>Nurse:</strong> {{ booking.nurseName }}</p>
          <p><strong>Service:</strong> {{ booking.service }}</p>
          <p><strong>Price:</strong> EGP {{ booking.price }}</p>
        </div>

        <div class="buttons-row">
          <button
            v-if="!booking.review"
            @click="openModal(booking)"
            class="add-review"
          >
            Add Review
          </button>

          <button
            @click="bookSameNurse(booking.nurseId)"
            class="book-again-btn"
          >
            Book the Same Nurse
          </button>
        </div>

        <div v-if="booking.review" class="submitted-review">
          <p><strong>Your Review:</strong> {{ booking.review }}</p>
          <p><strong>Rating:</strong> {{ booking.rating }} ★</p>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <button class="close-btn" @click="closeModal">×</button>
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
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const router = useRouter();
const bookings = ref([]);
const activeBookings = ref([]);
const pastBookings = ref([]);
const loading = ref(true);
const userStore = useUserStore();
const userId = userStore.firebaseUser?.uid;

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const now = dayjs();

// Fetch all bookings of the user
const fetchBookings = async () => {
  loading.value = true;

  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  bookings.value = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  activeBookings.value = bookings.value.filter((b) => {
    const end = dayjs(`${b.date} ${b.to}`, "YYYY-MM-DD hh:mm A");
    return end.isAfter(now);
  });

  pastBookings.value = bookings.value.filter((b) => {
    const end = dayjs(`${b.date} ${b.to}`, "YYYY-MM-DD hh:mm A");
    return end.isBefore(now);
  });
  loading.value = false;
};

// Profile image
const profileImage = ref("");
const fullName = ref("");

// Listen to user document to keep profile image updated
const listenToUserProfile = () => {
  const userDocRef = doc(db, "users", userStore.firebaseUser.uid);
  onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const userData = docSnap.data();
      profileImage.value = userData.profileImage || "";
      fullName.value = userData.fullName || "";
    }
  });
};

// Modal states for review
const showModal = ref(false);
const selectedBooking = ref(null);
const rating = ref(0);
const comment = ref("");
const bookSameNurse = (nurseId) => {
  router.push({ path: "/bookingInformation", query: { nurseId } });
};
// Open modal to add review
const openModal = (booking) => {
  selectedBooking.value = booking;
  rating.value = 0;
  comment.value = "";
  showModal.value = true;
};

// Close review modal
const closeModal = () => {
  showModal.value = false;
};

// Submit review for a booking
const submitReview = async () => {
  if (rating.value === 0 || !comment.value.trim()) {
    alert("Please provide a star rating and comment.");
    return;
  }

  const bookingId = selectedBooking.value.id;

  // Step 1: Update the booking document with review and rating
  const bookingRef = doc(db, "bookings", bookingId);
  await updateDoc(bookingRef, {
    review: comment.value,
    rating: rating.value,
  });

  // Step 2: Add review document in reviews collection
  const reviewRef = doc(db, "reviews", bookingId);
  await setDoc(reviewRef, {
    bookingId,
    userId: userStore.firebaseUser.uid,
    nurseId: selectedBooking.value.nurseId,
    comment: comment.value,
    rating: rating.value,
    createdAt: serverTimestamp(),
    fullName: fullName.value,
    profileImage: profileImage.value,
  });

  // Update UI
  selectedBooking.value.review = comment.value;
  selectedBooking.value.rating = rating.value;

  showModal.value = false;
  alert("Review submitted successfully!");
};

// Fetch bookings and listen to profile image
onMounted(() => {
  fetchBookings();
  listenToUserProfile();
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
p {
  font-size: 1rem;
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
  all: unset;
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
  flex-direction: row-reverse;
}

.close-btn:hover {
  background-color: transparent;
  color: #000; /* or keep it same as normal */
  box-shadow: none;
  text-decoration: none;
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
.add-review {
  margin-right: 1rem;
}
.booking-info p {
  font-size: 1.15rem;
  margin-bottom: 0.3rem;
}
@media (max-width: 768px) {
  .my-bookings-page {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    text-align: center;
  }

  h2 {
    font-size: 1.2rem;
  }

  .booking-card {
    padding: 1rem;
    border-radius: 12px;
  }

  .booking-info p {
    font-size: 1rem;
  }

  .buttons-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .add-review,
  .book-again-btn {
    width: 100%;
    text-align: center;
  }

  .modal-box {
    width: 95%;
    padding: 1rem;
  }

  .modal-box textarea {
    font-size: 1rem;
  }

  .modal-box button {
    font-size: 1rem;
  }

  .star {
    font-size: 1.5rem;
  }
}
</style>
