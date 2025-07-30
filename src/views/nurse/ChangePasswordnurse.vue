<template>
  <div class="change-password">
    <div class="container">
      <!-- Back button at top-left -->
      <div class="back-button" @click="$router.back()">← Back</div>

      <h2>Change Password</h2>

      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            v-model="currentPassword"
            placeholder="Enter current password"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            placeholder="Enter new password"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit">Update Password</button>

        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const successMessage = ref("");
const errorMessage = ref("");

const auth = getAuth();
const user = auth.currentUser;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const handleChangePassword = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!user) {
    errorMessage.value = "User not logged in.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New passwords do not match.";
    return;
  }

  if (!passwordRegex.test(newPassword.value)) {
    errorMessage.value =
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.";
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword.value);

    successMessage.value = "Password updated successfully.";
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error) {
    console.error("Error:", error);
    errorMessage.value =
      error.message || "Failed to change password. Please try again.";
  }
};
</script>

<style scoped>
.change-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #eef2f5;
  padding: 1rem;
}
.back-button {
  color: #19599a;
  cursor: pointer;
  font-weight: bold;
}
.container {
  position: relative;
  background: #fff;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-btn-top {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  background-color: #ffffffff;
  color: gray;
  border: 1px solid #19599a;
  border-radius: 6px;
  cursor: pointer;
  width: auto;
}

.back-btn-top:hover {
  background-color: #5a6268;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.4rem;
}

input[type="password"] {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #19599a;
  color: white;
}

button[type="submit"]:hover {
  background-color: #67aef5ff;
}

.success {
  color: green;
  text-align: center;
  margin-top: 1rem;
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .container {
    padding: 1.5rem;
  }
}
</style>
