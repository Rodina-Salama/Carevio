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
          <router-link to="/" @click="closeMenu" active-class="active-link">
            {{ $t("navbar.home") }}</router-link
          >
        </li>
        <li>
          <router-link
            to="/about"
            @click="closeMenu"
            active-class="active-link"
          >
            {{ $t("navbar.about") }}</router-link
          >
        </li>
        <li>
          <router-link
            to="/browse"
            @click="closeMenu"
            active-class="active-link"
          >
            {{ $t("navbar.browse") }}</router-link
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
            to="/my-bookings"
            @click="closeMenu"
            active-class="active-link"
          >
            {{ $t("navbar.bookings") }}</router-link
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

      <div class="user-menu" ref="dropdownRef">
        <div class="user-info" @click="toggleDropdown">
          <img
            :src="userStore.profileData.profileImage || avatarPlaceholder"
            class="user-avatar"
            alt="avatar"
          />
          <span class="user-name">{{ userStore.profileData.fullName }}</span>
        </div>
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <button class="dropdown-item" @click="handleProfileClick">
            {{ $t("navbar.profile") }}
          </button>
          <button class="dropdown-item" @click="logout">
            {{ $t("navbar.logout") }}
          </button>
        </div>
      </div>

      <div class="notification-menu" ref="notifDropdownRef">
        <div class="notification-icon" @click="toggleNotifDropdown">
          <span class="bell">🔔</span>
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </div>
        <div v-if="isNotifOpen" class="dropdown-menu notif-dropdown">
          <div v-if="notifications.length === 0" class="no-notifications">
            No notifications
          </div>
          <div
            v-else
            v-for="notif in notifications"
            :key="notif.id"
            class="notification-item"
            @click="handleNotifClick(notif)"
          >
            <p class="notif-message">{{ notif.message }}</p>
            <p class="notif-time">
              {{ notif.createdAt.toDate().toLocaleString() }}
            </p>
            <span v-if="!notif.isRead" class="unread-dot"></span>
          </div>
        </div>
      </div>

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
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/userStore";
import avatarPlaceholder from "@/assets/avatar.jpg";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

const { locale } = useI18n();
const currentLang = ref(locale.value);
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);
const isNotifOpen = ref(false);
const notifDropdownRef = ref(null);
const notifications = ref([]);
const unreadCount = ref(0);

import egyptFlag from "@/assets/egflag.png";
import usFlag from "@/assets/usflag.png";

function toggleLang() {
  currentLang.value = currentLang.value === "ar" ? "en" : "ar";
  locale.value = currentLang.value;
  localStorage.setItem("lang", currentLang.value);
}

onMounted(() => {
  const savedLang = localStorage.getItem("lang") || "en";
  currentLang.value = savedLang;
  locale.value = savedLang;

  // Setup notifications listener if user is logged in
  if (auth.currentUser) {
    const userId = auth.currentUser.uid;
    const notifsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    onSnapshot(notifsQuery, (snapshot) => {
      notifications.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
    });
  }

  document.addEventListener("click", handleClickOutside);
});

const userStore = useUserStore();
const router = useRouter();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const logout = async () => {
  await signOut(auth);
  userStore.clearUser();
  router.push("/");
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
  if (
    notifDropdownRef.value &&
    !notifDropdownRef.value.contains(event.target)
  ) {
    isNotifOpen.value = false;
  }
};
const handleProfileClick = () => {
  router.push("/userprofile");
  closeDropdown();
};

const toggleNotifDropdown = () => {
  isNotifOpen.value = !isNotifOpen.value;
  if (isNotifOpen.value) {
    markAllAsRead();
  }
};

const closeNotifDropdown = () => {
  isNotifOpen.value = false;
};

const markAllAsRead = async () => {
  for (const notif of notifications.value) {
    if (!notif.isRead) {
      const notifRef = doc(db, `bookings/${notif.id}`); // Updated to bookings collection
      try {
        await updateDoc(notifRef, { isRead: true });
        notif.isRead = true; // Update local state
      } catch (error) {
        console.error(`Failed to update booking ${notif.id}:`, error);
      }
    }
  }
  unreadCount.value = 0;
};

const handleNotifClick = () => {
  router.push("/my-bookings");
  closeNotifDropdown();
};

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
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
  /* overflow-x: hidden; Prevent horizontal scrollbar on navbar */
}
.dropdown-router {
  text-decoration: none;
  color: inherit;
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
  background-color: #f2f2f2;
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
  background-color: #d6d6d6;
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
  font-weight: 500;
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
  color: white;
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
  background-color: #0056b3;
}

.btn.outline {
  background-color: transparent;
  color: #19599a;
  border: 1px solid #19599a;
}

.btn.outline:hover {
  background-color: #19599a;
  color: white;
}

.active-btn {
  background-color: #0d3c6e;
  color: white;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  z-index: 10;
  border-radius: 6px;
  overflow: hidden;
  min-width: 150px;
}

.dropdown-item {
  padding: 10px 16px;
  text-align: left;
  background: white;
  border: none;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  color: black;
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

  .btn {
    width: 100%;
    padding: 0.75rem;
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
  .dropdown-menu {
    all: unset;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }

  .dropdown-item {
    all: unset;
    padding: 8px 12px;
    font-size: 0.95rem;
    border: 1px solid #19599a;
    border-radius: 6px;
    text-align: center;
    color: #19599a;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  .dropdown-item:hover {
    background-color: #f0f0f0;
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
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
}
.user-menu {
  position: relative;
}
.dropdown-item:hover {
  background: #f0f0f0;
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

/* New styles for notifications */
.notification-menu {
  position: relative;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 1.5rem;
}

.bell {
  color: #19599a;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-weight: bold;
}

.notif-dropdown {
  max-width: calc(
    100vw - 100px
  ); /* Account for 50px left gap + 50px right buffer */
  min-width: 200px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  left: 10px;
  right: auto;
  transform: translateX(0);
  position: absolute;
  top: 100%;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  z-index: 10;
  border-radius: 6px;
}

[dir="rtl"] .notif-dropdown {
  left: 50px; /* 50px gap from left in RTL */
  right: auto;
}

[dir="ltr"] .notif-dropdown {
  right: 50px; /* 50px gap from right in LTR */
  left: auto;
}

.notification-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f0f0f0;
}

.notif-message {
  margin: 0;
  font-size: 14px;
}

.notif-time {
  margin: 0;
  font-size: 12px;
  color: #888;
}

.unread-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}

.no-notifications {
  padding: 10px;
  text-align: center;
  color: #888;
}

@media (max-width: 768px) {
  .notification-menu .dropdown-menu {
    all: unset;
    margin-top: 12px;
    width: calc(100% - 20px);
    max-width: calc(100vw - 20px);
    left: 10px;
    right: 10px;
  }

  .notification-item {
    border: 1px solid #eee;
    border-radius: 6px;
    margin-bottom: 8px;
  }
}
</style>
