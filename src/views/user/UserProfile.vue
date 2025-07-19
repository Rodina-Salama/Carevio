<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Profile</h1>

      <div class="profile-header">
        <div class="profile-picture">
          <img
            :src="require('@/assets/' + user.profileImage)"
            alt="Profile Picture"
          />
        </div>
        <h2>{{ user.name }}</h2>
      </div>

      <div class="account-section">
        <h3>Account</h3>
        <div class="info-item">
          <label>Mobile Phone</label>
          <div class="info-value">{{ user.phone }}</div>
        </div>
        <div class="info-item">
          <label>Email</label>
          <div class="info-value">{{ user.email }}</div>
        </div>
      </div>

      <div class="actions-section">
        <h3>Actions</h3>
        <div class="actions-container">
          <button @click="editProfile" class="action-btn">Edit Profile</button>
          <button @click="changePassword" class="action-btn">
            Change Password
          </button>
          <button @click="logout" class="action-btn logout-btn">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: "Sophia Carter",
        phone: "+01 234 5678 9",
        email: "sophia.carter@example.com",
        profileImage: "sophia.jpg",
      },
    };
  },
  methods: {
    editProfile() {
      alert("Edit Profile clicked");
      // Add your edit profile logic here
    },
    changePassword() {
      alert("Change Password clicked");
      // Add your change password logic here
    },
    logout() {
      alert("Logout clicked");
      // Add your logout logic here
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 500px; /* Slightly narrower container */
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-card {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.profile-header {
  text-align: center;
  margin: 20px 0;
}

.profile-picture {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #4a6fa5;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header h2 {
  color: #444;
  margin: 10px 0;
}

.account-section,
.actions-section {
  margin-bottom: 25px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.info-item {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  padding: 8px 12px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #eee;
}

.actions-container {
  max-width: 300px; /* Narrower buttons container */
  margin: 0 auto;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background-color: #3a5a8a;
}

.logout-btn {
  background-color: #e74c3c;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
