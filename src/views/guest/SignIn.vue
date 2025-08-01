<template>
  <div class="page-container">
    <div class="centered-container">
      <div class="login-container">
        <div class="login-left">
          <form @submit.prevent="loginUser" class="auth-form">
            <h2 class="form-title">{{ $t("signIn.title") }}</h2>

            <div class="form-group">
              <label for="email">{{ $t("signIn.email") }}</label>
              <input
                type="email"
                id="email"
                v-model="user.email"
                :placeholder="$t('signIn.emailPlaceholder')"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">{{ $t("signIn.password") }}</label>
              <input
                type="password"
                id="password"
                v-model="user.password"
                :placeholder="$t('signIn.passwordPlaceholder')"
                required
              />
            </div>
            <p class="forgot-password">
              <router-link to="/forgotpassword">{{
                $t("signIn.forgotPassword")
              }}</router-link>
            </p>

            <div class="error-message" v-if="messageError">
              {{ messageError }}
            </div>

            <button type="submit" class="btn btn-primary">
              {{ $t("signIn.login") }}
            </button>

            <p class="signup-link">
              {{ $t("signIn.dontHaveAccount") }}
              <router-link to="/signup" class="signup-link-text">{{
                $t("signIn.signUp")
              }}</router-link>
            </p>
          </form>
        </div>
        <div class="login-right">
          <img
            src="@/assets/nurseman2.png"
            alt="Login illustration"
            class="login-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import router from "@/router";
import { useUserStore } from "@/stores/userStore";

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
    async loginUser() {
      const userStore = useUserStore();

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.user.email,
          this.user.password
        );
        const currentUser = userCredential.user;

        await currentUser.reload();

        if (!currentUser.emailVerified) {
          this.messageError = "Please verify your email before logging in.";
          await signOut(auth); // مهم علشان يوقف تسجيل الدخول فعليًا
          setTimeout(() => {
            this.messageError = "";
          }, 5000);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const type = userData.type;

          await userStore.setUser(currentUser, userData);

          if (type === "nurse") {
            router.push({ name: "DashBoard" });
          } else if (type === "user") {
            router.push({ name: "HomePage" });
          } else {
            this.messageError = "Unknown user type.";
          }
        } else {
          this.messageError = "User data not found.";
        }
      } catch (error) {
        this.messageError = "Invalid email or password.";
        setTimeout(() => {
          this.messageError = "";
        }, 4000);
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.centered-container {
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-container {
  display: flex;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
}

.login-left {
  flex: 1;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-right {
  flex: 1;
  background-color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

.form-title {
  margin-bottom: 30px;
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.form-group input:focus {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #67aef5ff;
  transform: translateY(-1px);
}

.signup-link {
  margin-top: 25px;
  color: #718096;
  font-size: 0.95rem;
  text-align: center;
}

.signup-link-text {
  color: #4299e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link-text:hover {
  color: #3182ce;
  text-decoration: underline;
}

.error-message {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  font-size: 0.95rem;
  text-align: center;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-6px);
  }

  50% {
    transform: translateX(6px);
  }

  75% {
    transform: translateX(-6px);
  }
}

@media (max-width: 900px) {
  .login-container {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 500px;
  }

  .login-image {
    display: none !important;
  }
  .login-right {
    display: none !important;
  }

  .login-left {
    padding: 40px;
  }
}

@media (max-width: 600px) {
  .login-left {
    padding: 30px 20px;
  }
  .login-image {
    display: none !important;
  }
  .login-right {
    display: none !important;
  }
  .form-title {
    font-size: 1.8rem;
  }

  .form-group input {
    padding: 12px;
  }

  .btn-primary {
    padding: 14px;
  }
}
</style>
