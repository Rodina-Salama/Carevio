<template>
  <div class="find-account-container">
    <h2>Find Your Account</h2>
    <p>Please enter your email address to search for your account.</p>

    <form @submit.prevent="searchAccount" class="account-search-form">
      <div class="input-group">
        <input
          type="email"
          id="search-input"
          v-model="searchText"
          placeholder="Email address"
          required
        />
      </div>

      <div class="button-group">
        <router-link to="/signin" class="btn btn-secondary">
          Cancel
        </router-link>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!searchText.trim()"
        >
          Send
        </button>
      </div>
    </form>

    <div v-if="loading" class="loading-indicator">
      Searching for your account...
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default {
  name: "FindAccount",
  setup() {
    const searchText = ref("");
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const auth = getAuth();
    const db = getFirestore();
    const isValidEmail = (email) => {
      const pattern = /^[^\s@]+@[^\s@]+\.(com|net|org|io|eg)$/i;
      return pattern.test(email);
    };

    const searchAccount = async () => {
      const email = searchText.value.trim().toLowerCase();
      errorMessage.value = "";
      successMessage.value = "";

      if (!isValidEmail(email)) {
        errorMessage.value = "Please enter a valid email address.";
        return;
      }

      loading.value = true;

      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          errorMessage.value = "This email is not registered in our system.";
        } else {
          try {
            await sendPasswordResetEmail(auth, email);
            successMessage.value =
              "Password reset email sent. Please check your inbox.";
          } catch (e) {
            console.error("Reset email error:", e);
            errorMessage.value =
              "Email found, but reset email could not be sent. Possibly registered with a provider like Google.";
          }
        }
      } catch (err) {
        console.error("Firestore error:", err);
        errorMessage.value = "Something went wrong. Try again later.";
      } finally {
        loading.value = false;
      }
    };

    return {
      searchText,
      loading,
      errorMessage,
      successMessage,
      searchAccount,
    };
  },
};
</script>

<style scoped>
.find-account-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 600;
}

p {
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
}

.account-search-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group input[type="email"] {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-group input[type="email"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  outline: none;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-primary {
  background-color: #19599a;
  color: white;
  text-decoration: none;
}

.btn-primary:hover {
  background-color: #1877f2;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: white;
  color: #495057;
  border: 1px solid #ced4da;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover {
  background-color: #dee2e6;
  transform: translateY(-2px);
}

.loading-indicator,
.error-message,
.success-message {
  margin-top: 25px;
  padding: 12px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
}

.loading-indicator {
  background-color: #e9f7ef;
  color: #28a745;
  border: 1px solid #28a745;
}

.error-message {
  background-color: #fcebe9;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #155724;
}
</style>
