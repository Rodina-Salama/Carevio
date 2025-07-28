<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-image">
        <img src="@/assets/nurse2.png" alt="Sign up illustration" />
      </div>
      <main class="register-content">
        <form
          @submit.prevent="registerUser"
          class="auth-form"
          v-if="!showSuccessMessage"
        >
          <h2 class="form-title">Create your account</h2>

          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              v-model.trim="user.fullName"
              placeholder="Enter Your Full Name"
              required
              @blur="validateName"
              :class="{ 'input-error': errors.name }"
            />
            <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model.trim="user.email"
              placeholder="Enter Your Email"
              required
              @blur="validateEmail"
              :class="{ 'input-error': errors.email }"
            />
            <span v-if="errors.email" class="error-text">{{
              errors.email
            }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              v-model.trim="user.phone"
              placeholder="01XXXXXXXXX"
              required
              @blur="validatePhone"
              :class="{ 'input-error': errors.phone }"
            />
            <span v-if="errors.phone" class="error-text">{{
              errors.phone
            }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model.trim="user.password"
              placeholder="Enter Your Password"
              required
              @blur="validatePassword"
              :class="{ 'input-error': errors.password }"
            />
            <span v-if="errors.password" class="error-text">{{
              errors.password
            }}</span>
          </div>

          <div class="form-group">
            <label for="passwordConfirmation">Password Confirmation</label>
            <input
              type="password"
              id="passwordConfirmation"
              v-model.trim="user.passwordConfirmation"
              placeholder="Confirm Your Password"
              required
              @blur="validatePasswordConfirmation"
              :class="{ 'input-error': errors.passwordConfirmation }"
            />
            <span v-if="errors.passwordConfirmation" class="error-text">{{
              errors.passwordConfirmation
            }}</span>
          </div>

          <button type="submit" class="btn btn-primary">Create Account</button>

          <p class="login-link">
            Already have an account?
            <router-link to="/signIn" class="login-link-text"
              >Sign In</router-link
            >
          </p>
        </form>

        <div v-if="showSuccessMessage" class="success-message-container">
          <h2 class="success-title">Account Created Successfully!</h2>
          <div class="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#2ecc71"
              width="64px"
              height="64px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
          </div>
          <p class="success-text">
            We've sent a verification email to <strong>{{ user.email }}</strong
            >. Please check your inbox and verify your email address.
          </p>
          <p class="success-note">
            You'll be redirected to login in {{ countdown }} seconds...
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import router from "@/router";

export default {
  name: "SignUp",
  data() {
    return {
      user: {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
      },
      errors: {
        name: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
      },
      showSuccessMessage: false,
      countdown: 5,
      countdownInterval: null,
    };
  },
  methods: {
    validateName() {
      this.errors.name =
        this.user.fullName.length < 8
          ? "Full name must be at least 8 characters"
          : "";
    },
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.(com|net|org|io|eg|edu|gov|co)$/i;
      this.errors.email = !regex.test(this.user.email)
        ? "Please enter a valid email with an accepted domain"
        : "";
    },
    validatePhone() {
      const regex = /^(01)[0-2,5]{1}[0-9]{8}$/;
      this.errors.phone = !regex.test(this.user.phone)
        ? "Phone must be a valid Egyptian number (e.g. 01XXXXXXXXX)"
        : "";
    },
    validatePassword() {
      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
      this.errors.password = !regex.test(this.user.password)
        ? "Password must contain at least 6 characters, one uppercase, one lowercase and one number"
        : "";
    },
    validatePasswordConfirmation() {
      this.errors.passwordConfirmation =
        this.user.password !== this.user.passwordConfirmation
          ? "Passwords do not match"
          : "";
    },
    validateForm() {
      this.validateName();
      this.validateEmail();
      this.validatePhone();
      this.validatePassword();
      this.validatePasswordConfirmation();

      return !Object.values(this.errors).some((error) => error !== "");
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
        } else {
          clearInterval(this.countdownInterval);
          router.push({ name: "SignIn" });
        }
      }, 1000);
    },
    async registerUser() {
      if (!this.validateForm()) return;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );
        const currentUser = userCredential.user;

        await updateProfile(currentUser, { displayName: this.user.fullName });

        await setDoc(doc(db, "users", currentUser.uid), {
          fullName: this.user.fullName,
          email: this.user.email,
          phone: this.user.phone,
          type: "user",
          password: this.user.password,
          createdAt: serverTimestamp(),
        });

        await sendEmailVerification(currentUser);

        this.showSuccessMessage = true;
        this.startCountdown();
      } catch (error) {
        const errorMap = {
          "auth/email-already-in-use": "This email is already in use.",
          "auth/invalid-email": "Invalid email address.",
          "auth/weak-password": "Password should be at least 6 characters.",
        };
        this.errors.email =
          errorMap[error.code] || "Registration failed. Please try again.";
      }
    },
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-container {
  display: flex;
  max-width: 900px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.register-image {
  flex: 1;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-image img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.register-content {
  flex: 1;
  padding: 40px;
}

.auth-form {
  width: 100%;
}

.form-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-error {
  border-color: #e74c3c !important;
}

.error-text {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #e74c3c;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.login-link-text {
  color: #3498db;
  font-weight: 500;
  text-decoration: none;
}

.login-link-text:hover {
  text-decoration: underline;
}

.success-message-container {
  text-align: center;
  padding: 20px;
}

.success-title {
  color: #2ecc71;
  margin-bottom: 20px;
  font-size: 24px;
}

.success-icon {
  margin: 20px 0;
  animation: bounce 0.5s;
}

.success-text {
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.6;
}

.success-note {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 20px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-image {
    display: none;
  }

  .register-content {
    padding: 30px 20px;
  }
}
</style>
