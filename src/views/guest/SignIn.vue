<template>
  <div class="login-page">
    <main class="login-content">
      <form @submit.prevent="loginUser" class="auth-form">
        <h2 class="form-title">Welcome Back</h2>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            placeholder="Enter your Password"
            required
          />
        </div>

        <!-- ✅ Error message section -->
        <div class="error-message" v-if="messageError">
          {{ messageError }}
        </div>

        <button type="submit" class="btn btn-primary">Log In</button>

        <p class="signup-link">
          Don't Have Account?
          <a href="http://localhost:8080/#/signup">Sign Up</a>
        </p>
      </form>
    </main>
  </div>
</template>

<script>
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import router from "@/router";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      messageError: "",
    };
  },
  methods: {
    loginUser() {
      signInWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then(() => {
          router.push({ name: "HomePage" });
        })
        .catch(() => {
          this.messageError = "Invalid email or password";
          setTimeout(() => {
            this.messageError = "";
          }, 4000); // 🕓 hides after 4 seconds
        });
    },
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.login-content {
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
}

.auth-form {
  background-color: #fff;
  padding: 40px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
  margin: 0 auto;
}

.form-title {
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 1rem;
}

.form-group input {
  width: calc(100% - 22px);
  padding: 12px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1.1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.signup-link {
  margin-top: 25px;
  color: #666;
  font-size: 0.95rem;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* ✅ Error Message Style */
.error-message {
  background-color: #ffe6e6;
  color: #d8000c;
  border: 1px solid #d8000c;
  padding: 12px 16px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 1rem;
  text-align: center;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  50% {
    transform: translateX(5px);
  }

  75% {
    transform: translateX(-5px);
  }

  100% {
    transform: translateX(0);
  }
}

/* ✅ Responsive */
@media (max-width: 768px) {
  .login-content {
    padding: 15px;
  }

  .auth-form {
    padding: 30px 20px;
    margin: 0 auto;
  }

  .form-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }

  .form-group label {
    font-size: 0.95rem;
  }

  .form-group input {
    font-size: 1rem;
    padding: 10px;
  }

  .btn-primary {
    font-size: 1rem;
    padding: 12px;
  }

  .signup-link {
    font-size: 0.9rem;
  }

  .error-message {
    font-size: 0.95rem;
    padding: 10px 14px;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 10px;
  }

  .auth-form {
    padding: 25px 15px;
    margin: 0 auto;
  }

  .form-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }

  .form-group input {
    font-size: 0.95rem;
  }

  .btn-primary {
    font-size: 0.95rem;
    padding: 10px;
  }

  .signup-link {
    font-size: 0.85rem;
  }

  .error-message {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>
