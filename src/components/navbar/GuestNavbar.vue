<template>
  <nav class="navbar" v-if="!loading">
    <div class="navbar-brand">
      <img src="@/assets/icon2.png" alt="Logo" class="logo" />
      <span class="site-name">Carevio</span>
      <button class="hamburger" @click="toggleMenu" aria-label="Menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>

    <div class="navbar-menu" :class="{ active: isMenuOpen }">
      <ul class="nav-links">
        <li>
          <router-link to="/" @click="closeMenu" active-class="active-link">{{
            $t("navbar.home")
          }}</router-link>
        </li>
        <li>
          <router-link
            to="/about"
            @click="closeMenu"
            active-class="active-link"
            >{{ $t("navbar.about") }}</router-link
          >
        </li>
        <li>
          <router-link
            to="/browse"
            @click="closeMenu"
            active-class="active-link"
            >{{ $t("navbar.browse") }}</router-link
          >
        </li>
        <li>
          <router-link
            to="/services"
            @click="closeMenu"
            active-class="active-link"
          >
            {{ $t("navbar.services") }}</router-link
          >
        </li>
        <li>
          <router-link
            to="/contact"
            @click="closeMenu"
            active-class="active-link"
          >
            {{ $t("navbar.contact") }}</router-link
          >
        </li>
      </ul>

      <div class="navbar-actions">
        <router-link
          to="/signin"
          class="btn outline"
          @click="closeMenu"
          active-class="active-btn"
          >{{ $t("navbar.signIn") }}</router-link
        >
        <router-link
          to="/join"
          class="btn btn1"
          @click="closeMenu"
          active-class="active-btn"
          >{{ $t("navbar.joinAsNurse") }}</router-link
        >
        <router-link
          to="/signup"
          class="btn btn1"
          @click="closeMenu"
          active-class="active-btn"
          >{{ $t("navbar.signUp") }}</router-link
        >
        <div class="lang-switch-container" @click="toggleLang">
          <img
            :src="currentLang === 'ar' ? usFlag : egyptFlag"
            alt="flag"
            class="lang-flag"
          />
          <button class="lang-circle-btn">
            <span>{{ currentLang === "ar" ? "EN" : "AR" }}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import egyptFlag from "@/assets/egflag.png";
import usFlag from "@/assets/usflag.png";
const { locale } = useI18n();
const currentLang = ref("ar");

function toggleLang() {
  currentLang.value = currentLang.value === "ar" ? "en" : "ar";
  locale.value = currentLang.value;
  localStorage.setItem("lang", currentLang.value);
}

onMounted(() => {
  const savedLang = localStorage.getItem("lang") || "en";
  currentLang.value = savedLang;
  locale.value = savedLang;
});

// Menu state
const isMenuOpen = ref(false);

// Menu actions
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>
<style scoped>
.navbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-family: "Cairo", sans-serif;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  height: 2.5rem;
}

.site-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #19599a;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}

.nav-links a {
  text-decoration: none;
  color: #444;
  font-weight: 800;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  padding: 0.5rem 0;
}

.nav-links a:hover {
  color: #19599a;
}

.nav-links .active-link {
  color: #19599a;
  font-weight: 600;
}

.nav-links .active-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #19599a;
}

.navbar-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  background-color: #19599a;
  color: #f1e7e7ff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
}

.btn:hover {
  background-color: #67aef5ff;
}

.btn.outline {
  background-color: transparent;
  color: #19599a;
  border: 1px solid #19599a;
}

.btn.outline:hover {
  background-color: #67aef5ff;
  color: #ffffff;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.lang-switch-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.lang-flag {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.lang-circle-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c8dff6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  color: #444;
  transition: background-color 0.3s;
}

.lang-circle-btn:hover {
  background-color: #a4caf0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hamburger {
  display: none;
  background-color: #19599a;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger .bar {
  display: block;
  width: 1.5rem;
  height: 2px;
  background-color: #ffffffff;
  margin: 0.3rem 0;
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .navbar {
    padding: 1rem;
  }

  .navbar-menu {
    gap: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }

  .navbar-brand {
    justify-content: space-between;
  }

  .hamburger {
    display: block;
  }

  .navbar-menu {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }

  .navbar-menu.active {
    max-height: 100vh;
    padding: 1rem 0;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-links a {
    padding: 0.75rem 1rem;
  }

  .nav-links .active-link::after {
    left: 1rem;
    width: calc(100% - 2rem);
  }

  .navbar-actions {
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .hamburger.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.active .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

@media (max-width: 480px) {
  .site-name {
    font-size: 1.2rem;
  }

  .logo {
    height: 2rem;
  }
}
@media (max-width: 768px) {
  .btn {
    font-size: 0.9rem;
  }
}
</style>
