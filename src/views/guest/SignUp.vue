<template>
  <div class="register-page">
    <main class="register-content">
      <form @submit.prevent="registerUser" class="auth-form">
        <h2 class="form-title">Create your account</h2>

        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            v-model="user.fullName"
            placeholder="Enter Your Full Name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter Your Email"
            required
            @blur="validateEmail"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            v-model="user.phone"
            placeholder="Enter your phone number"
            required
            @blur="validatePhone"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            placeholder="Enter Your Password"
            required
            @blur="validatePassword"
          />
        </div>

        <div class="form-group">
          <label for="passwordConfirmation">Password Confirmation</label>
          <input
            type="password"
            id="passwordConfirmation"
            v-model="user.passwordConfirmation"
            placeholder="Confirm Your Password"
            required
            @blur="validatePasswordConfirmation"
          />
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary">Create Account</button>

        <p class="login-link">
          Already have an account?
          <a href="http://localhost:8080/#/signIn">Sign In</a>
        </p>
      </form>
    </main>
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
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    validateEmail() {
      const regex = /^[^\s@]+@[^\s@]+\.(com|net|org|io|eg|edu|gov|co)$/i;
      this.errorMessage = !regex.test(this.user.email)
        ? "Please enter a valid email with an accepted domain (e.g. .com, .net, .org...)."
        : "";
    },
    validatePhone() {
      const regex = /^(01)[0-2,5]{1}[0-9]{8}$/;
      this.errorMessage = !regex.test(this.user.phone)
        ? "Phone must be a valid Egyptian number."
        : "";
    },
    validatePassword() {
      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
      this.errorMessage = !regex.test(this.user.password)
        ? "Password must contain at least 6 characters, one uppercase, one lowercase and one number."
        : "";
    },
    validatePasswordConfirmation() {
      this.errorMessage =
        this.user.password !== this.user.passwordConfirmation
          ? "Passwords do not match."
          : "";
    },
    async registerUser() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.user.password !== this.user.passwordConfirmation) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

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
          createdAt: serverTimestamp(),
        });

        await sendEmailVerification(currentUser);

        this.successMessage =
          "Verification email sent. Please check your inbox.";
        setTimeout(() => router.push({ name: "SignIn" }), 2000);
      } catch (error) {
        const errorMap = {
          "auth/email-already-in-use": "This email is already in use.",
          "auth/invalid-email": "Invalid email address.",
          "auth/weak-password": "Password should be at least 6 characters.",
        };
        this.errorMessage =
          errorMap[error.code] || "Registration failed. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 20px;
}

.register-content {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 35px 25px;
  border-radius: 14px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
}

.auth-form {
  width: 100%;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #1c1e21;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #1c1e21;
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dddfe2;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #1877f2;
  outline: none;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #67aef5;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #19599a;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #fce8e6;
  color: #d93025;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

.success-message {
  background-color: #e6f4ea;
  color: #137333;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}
</style>
