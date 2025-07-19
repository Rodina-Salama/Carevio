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

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary">Create Account</button>

        <p class="login-link">
          Already have an account? <a href="SignInPage">Log In</a>
        </p>
      </form>
    </main>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
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
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(this.user.email)) {
        this.errorMessage = "Please enter a valid email address.";
        this.successMessage = "";
      } else {
        this.errorMessage = "";
      }
    },
    validatePhone() {
      const regex = /^(01)[0-2,5]{1}[0-9]{8}$/;
      if (!regex.test(this.user.phone)) {
        this.errorMessage = "Phone must be a valid Egyptian number.";
        this.successMessage = "";
      } else {
        this.errorMessage = "";
      }
    },
    validatePassword() {
      const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
      if (!regex.test(this.user.password)) {
        this.errorMessage =
          "Password must contain at least 6 characters, one uppercase, one lowercase and one number.";
        this.successMessage = "";
      } else {
        this.errorMessage = "";
      }
    },
    validatePasswordConfirmation() {
      if (this.user.password !== this.user.passwordConfirmation) {
        this.errorMessage = "Passwords do not match.";
        this.successMessage = "";
      } else {
        this.errorMessage = "";
      }
    },
    registerUser() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.user.password !== this.user.passwordConfirmation) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: this.user.fullName,
          })
            .then(() => {
              sendEmailVerification(user)
                .then(() => {
                  this.successMessage =
                    "Verification email sent. Please check your inbox.";
                  this.errorMessage = "";
                  setTimeout(() => {
                    router.push({ name: "SignIn" });
                  }, 2000);
                })
                .catch(() => {
                  this.errorMessage = "Failed to send verification email.";
                  this.successMessage = "";
                });
            })
            .catch(() => {
              this.errorMessage = "Failed to set display name.";
              this.successMessage = "";
            });
        })
        .catch((error) => {
          this.successMessage = "";
          if (error.code === "auth/email-already-in-use") {
            this.errorMessage = "This email is already in use.";
          } else if (error.code === "auth/invalid-email") {
            this.errorMessage = "Invalid email address.";
          } else if (error.code === "auth/weak-password") {
            this.errorMessage = "Password should be at least 6 characters.";
          } else {
            this.errorMessage = "Registration failed. Please try again.";
          }
        });
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
  background-color: #e9ebee;
  padding: 20px;
}

.register-content {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 35px 25px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.auth-form {
  width: 100%;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 22px;
  color: #1c1e21;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #1c1e21;
  display: block;
  margin-bottom: 5px;
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
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #165edb;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.login-link a {
  color: #1877f2;
  text-decoration: none;
  font-weight: bold;
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
