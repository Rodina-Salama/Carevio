<template>
  <div class="change-password">
    <div class="container">
      <!-- Back button at top-left -->
      <button type="button" class="back-btn-top" @click="goBack">
        {{ $t("changePassword.back") }}
      </button>

      <h2>{{ $t("changePassword.title") }}</h2>

      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label for="currentPassword">{{
            $t("changePassword.current")
          }}</label>
          <input
            type="password"
            id="currentPassword"
            v-model="currentPassword"
            :placeholder="$t('changePassword.placeholderCurrent')"
            required
          />
        </div>

        <div class="form-group">
          <label for="newPassword">{{ $t("changePassword.new") }}</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            :placeholder="$t('changePassword.placeholderNew')"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">{{
            $t("changePassword.confirm")
          }}</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            :placeholder="$t('changePassword.placeholderConfirm')"
            required
          />
        </div>

        <button type="submit">{{ $t("changePassword.submit") }}</button>

        <p v-if="successMessage" class="success">
          {{ $t("changePassword.success") }}
        </p>
        <p v-if="errorMessage" class="error">
          {{ $t("changePassword.error") }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
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
const router = useRouter();

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

  if (newPassword.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters.";
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    // Re-authenticate user
    await reauthenticateWithCredential(user, credential);

    // Update password
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

const goBack = () => {
  router.push("/userprofile");
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
  background-color: #6c757d;
  color: white;
  border: none;
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
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0056b3;
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
