<template>
  <div class="dashboard-container">
    <NurseSidebar />
    <div class="main-content">
      <h1 class="page-title">Dashboard</h1>

      <div class="summary-cards">
        <div class="card">
          <h3>This Month’s Earnings</h3>
          <p class="value">EGP 4,250</p>
        </div>
        <div class="card">
          <h3>Sessions</h3>
          <p class="value">12</p>
        </div>
        <div class="card highlight">
          <h3>Next Booking</h3>
          <p class="value">July 23, 2025 - 8:00PM</p>
        </div>
      </div>

      <div class="lower-section">
        <div class="card full">
          <h3>Latest Review</h3>
          <div class="review-section">
            <img src="" alt="User" class="review-avatar" />
            <div class="review-details">
              <div class="review-header">
                <span class="review-name">Ahmed</span>
                <span class="review-time">2 days ago</span>
              </div>
              <div class="review-stars">⭐⭐⭐⭐⭐</div>
              <p class="review-comment">
                The nurse was extremely professional and caring!
              </p>
            </div>
          </div>
        </div>

        <div class="card full blue-card">
          <h3>Availability Reminder</h3>
          <p class="availability-message">
            Don’t forget to update your availability!
          </p>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions">
          <router-link to="/nurseavailability" class="action-btn"
            >Set Availability</router-link
          >
          <router-link to="/nursebookings" class="action-btn"
            >View Bookings</router-link
          >
          <router-link to="/nurseedit" class="action-btn"
            >Edit Profile</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";

export default {
  components: {
    NurseSidebar,
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #f4f6f8;
}

.main-content {
  flex: 1;
  padding: 24px 32px;
}

.page-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
}

.summary-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
}

.card {
  background-color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
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
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.card.full {
  flex: 1;
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
</style>
