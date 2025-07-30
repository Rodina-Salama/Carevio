<template>
  <div class="dashboard-container">
    <NurseSidebar />
    <div class="main-content">
      <h1 class="page-title">Dashboard</h1>
      <div v-if="isBanned" class="banned-alert">
        Your account has been <strong>banned</strong>. You cannot accept new
        bookings at the moment.
      </div>
      <div class="summary-cards">
        <div class="card">
          <h3>Total Earnings</h3>
          <p class="value">EGP {{ totalEarnings }}</p>
        </div>
        <div class="card">
          <h3>This Month’s Earnings</h3>
          <p class="value">EGP {{ monthlyEarnings }}</p>
        </div>
        <div class="card">
          <h3>Total Bookings</h3>
          <p class="value">{{ sessionCount }}</p>
        </div>
        <div class="card highlight">
          <h3>Next Booking</h3>
          <p class="value">
            {{
              nextBooking
                ? formatDate(nextBooking.date) +
                  " - " +
                  formatTime(nextBooking.from)
                : "No upcoming booking"
            }}
          </p>
        </div>
      </div>

      <div class="lower-section" v-if="latestReview">
        <div class="card full">
          <h3>Latest Review</h3>
          <div class="review-section">
            <img
              :src="latestReview.userImage || defaultAvatar"
              alt="User"
              class="review-avatar"
            />
            <div class="review-details">
              <div class="review-header">
                <span class="review-name">{{ latestReview.userName }}</span>
                <span class="review-time">
                  {{ timeAgo(latestReview.date) }}
                </span>
              </div>
              <div class="review-stars">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= latestReview.rating }"
                  >★</span
                >
              </div>
              <p class="review-comment">{{ latestReview.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";
import { ref, onMounted } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useUserStore } from "@/stores/userStore";

export default {
  components: { NurseSidebar },
  setup() {
    const userStore = useUserStore();
    const nurseId = userStore.firebaseUser?.uid;

    const totalEarnings = ref(0);
    const monthlyEarnings = ref(0);
    const sessionCount = ref(0);
    const nextBooking = ref(null);
    const latestReview = ref(null);
    const defaultAvatar = "/default-avatar.png";
    const isBanned = ref(false);

    async function fetchBannedStatus() {
      if (!nurseId) return;

      try {
        const docRef = doc(db, "applications", nurseId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          isBanned.value = docSnap.data().isBanned || false;
        }
      } catch (error) {
        console.error("Error fetching banned status:", error);
      }
    }

    // Helpers
    function formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    function formatTime(timeStr) {
      return timeStr;
    }
    function timeAgo(dateStr) {
      const now = new Date();
      const date = new Date(dateStr);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 60) return `${diffMins} minutes ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    }

    async function fetchBookings() {
      if (!nurseId) return;

      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("nurseId", "==", nurseId));
      const querySnapshot = await getDocs(q);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalEarn = 0;
      let earnings = 0;
      let sessions = 0;
      let futureBookings = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions++;
        const bookingStart = new Date(`${data.date} ${data.from}`);
        const bookingEnd = new Date(`${data.date} ${data.to}`);

        if (bookingEnd < now) {
          totalEarn += (data.price || 0) * 0.85;

          if (
            bookingEnd.getMonth() === currentMonth &&
            bookingEnd.getFullYear() === currentYear
          ) {
            earnings += (data.price || 0) * 0.85;
          }
        }

        if (bookingStart > now) {
          futureBookings.push(data);
        }
      });

      sessionCount.value = sessions;
      monthlyEarnings.value = earnings;
      totalEarnings.value = totalEarn;

      if (futureBookings.length) {
        futureBookings.sort(
          (a, b) =>
            new Date(`${a.date} ${a.from}`) - new Date(`${b.date} ${b.from}`)
        );
        nextBooking.value = futureBookings[0];
      }
    }

    async function fetchLatestReview() {
      if (!nurseId) return;

      const reviewsRef = collection(db, "reviews");
      const q = query(
        reviewsRef,
        where("nurseId", "==", nurseId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        latestReview.value = {
          userName: data.fullName || "Anonymous",
          userImage: data.profileImage || defaultAvatar,
          rating: data.rating || 0,
          comment: data.comment || "",
          date: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        };
      }
    }

    onMounted(async () => {
      await fetchBookings();
      await fetchLatestReview();
      await fetchBannedStatus();
    });

    return {
      totalEarnings,
      monthlyEarnings,
      sessionCount,
      nextBooking,
      latestReview,
      defaultAvatar,
      formatDate,
      timeAgo,
      formatTime,
      isBanned,
    };
  },
};
</script>
<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f8;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  flex-wrap: wrap;
}

.main-content {
  flex: 1;
  padding: 24px 32px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.page-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
}
.banned-alert {
  background-color: #ffebee;
  color: #c62828;
  padding: 16px;
  border-radius: 10px;
  font-weight: 500;
  margin-bottom: 24px;
  border: 1px solid #f44336;
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

.card {
  background-color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1 1 calc(33.333% - 13.33px); /* 3 in a row with gap */
  min-width: 240px;
  box-sizing: border-box;
}

.card.highlight {
  background-color: #19599a;
  color: white;
}

.card h3 {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.value {
  font-size: 20px;
  font-weight: bold;
}

.lower-section {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  width: 100%;
  box-sizing: border-box;
}

.card.full {
  flex: 1 1 100%;
}

.blue-card {
  background-color: #19599a;
  color: white;
}

.review-section {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 12px;
}

.review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.review-details {
  flex: 1;
  min-width: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 4px;
}

.review-name {
  font-size: 15px;
}

.review-time {
  font-size: 13px;
  color: #aaa;
}

.review-stars {
  font-size: 16px;
  margin-bottom: 4px;
}

.review-comment {
  font-size: 14px;
  color: #333;
}

.availability-message {
  font-size: 14px;
  margin-top: 10px;
}

.quick-actions {
  margin-top: 20px;
}

.quick-actions h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.action-btn {
  background-color: #19599a;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s;
}

.action-btn:hover {
  background-color: #144a84;
}

.star {
  font-size: 18px;
  color: #ccc;
}

.star.filled {
  color: gold;
}

/* Mobile only (below 768px) */
@media (max-width: 767px) {
  .card {
    flex: 1 1 100%;
  }

  .main-content {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .card h3 {
    font-size: 15px;
  }

  .value {
    font-size: 18px;
  }

  .action-btn {
    padding: 8px 12px;
    font-size: 14px;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
