<template>
  <div class="sidebar-container">
    <!-- Logo -->
    <div class="logo">
      <img src="@/assets/icon.jpg" alt="Logo" class="logo-img" />
      <span class="site-name">Carevio</span>
    </div>

    <!-- Navigation -->
    <ul class="nav-links">
      <li v-for="item in navItems" :key="item.path">
        <router-link
          :to="item.path"
          class="nav-link"
          :class="{ active: $route.path.startsWith(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </li>

      <!-- Sign Out -->
      <li>
        <button class="nav-link signout-link" @click="signOut">Sign Out</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "NurseSidebar",
  data() {
    return {
      navItems: [
        { label: "Availability", path: "/nurseavailability" },
        { label: "Bookings", path: "/nursebookings" },
        { label: "Earnings", path: "/nurseearnings" },
        { label: "Reviews", path: "/nursereviews" },
        { label: "Edit Profile", path: "/nurseedit" },
      ],
      userName: "",
      userPhotoURL: "",
      defaultAvatar: "https://via.placeholder.com/60", // صورة افتراضية
    };
  },
  mounted() {
    this.$emit("nurse-layout", true);

    const guestNavbar = document.querySelector(".guest-navbar");
    if (guestNavbar) guestNavbar.style.display = "none";

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.userName = user.displayName || "Nurse Name";
      this.userPhotoURL = user.photoURL || "";
    }
  },
  beforeUnmount() {
    const guestNavbar = document.querySelector(".guest-navbar");
    if (guestNavbar) guestNavbar.style.display = "block";

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";

    this.$emit("nurse-layout", false);
  },
  methods: {
    async signOut() {
      try {
        await signOut(getAuth());
        this.$router.push("/login");
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  width: 250px;
  background-color: #19599a;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.site-name {
  font-size: 22px;
  font-weight: bold;
}

/* User Info */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  border: 2px solid white;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
}

/* Navigation */
.nav-links {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-grow: 1;
}

.nav-link {
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  background-color: transparent;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: left;
  border: none;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.nav-link:hover {
  background-color: white;
  color: #19599a;
}

.nav-link.active {
  background-color: white;
  color: #19599a;
  font-weight: bold !important;
}

.signout-link {
  background-color: transparent;
  color: white;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
}

.signout-link:hover {
  background-color: white;
  color: #19599a;
}
</style>
