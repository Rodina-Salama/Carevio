<template>
  <div class="dashboard-container">
    <NurseSidebar />
    <div class="main-content">
      <h1 class="title">Nurse Bookings</h1>

      <div v-if="loading" class="no-bookings">Loading...</div>
      <div v-else-if="bookings.length === 0" class="no-bookings">
        No bookings available.
      </div>

      <div v-else class="bookings-grid">
        <div v-for="booking in bookings" :key="booking.id" class="booking-card">
          <div class="card-left">
            <img
              class="client-img"
              :src="booking.image || 'https://via.placeholder.com/48'"
              alt="client"
            />
            <div class="info">
              <div class="client-name">{{ booking.clientname }}</div>
              <div class="address">{{ booking.address }}</div>
              <div class="service">{{ booking.service }}</div>
            </div>
          </div>
          <button class="view-btn">View</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  components: {
    NurseSidebar,
  },
  data() {
    return {
      bookings: [],
      loading: true,
    };
  },
  mounted() {
    this.loadBookings();
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
  },
  beforeUnmount() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";
  },
  methods: {
    async loadBookings() {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        this.bookings = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...data,
          };
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #f9f9f9;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #111;
}

.no-bookings {
  text-align: center;
  color: #777;
  font-size: 18px;
}

.bookings-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-card {
  background: #f2f2f2;
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
}

.booking-card:hover .view-btn {
  background-color: #fff;
  color: #19599a;
  border: 1px solid #19599a;
}

.card-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.client-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  /* Tight spacing */
}

.client-name {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

.address,
.service {
  font-size: 14px;
  color: #555;
  margin: 0;
}

.view-btn {
  background-color: #19599a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;
}
</style>
