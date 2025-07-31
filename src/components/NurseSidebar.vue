<template>
  <div>
    <button class="sidebar-toggle" @click="toggleSidebar">
      <span class="toggle-label">{{ $t("navbar.dashboard") }}</span>
    </button>

    <div
      :class="[
        'sidebar-container',
        { 'sidebar-hidden': isMobile && !sidebarVisible },
      ]"
    >
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/logo2.png" alt="Logo" class="logo-img" />
        <span class="site-name">Carevio</span>
      </div>

      <!-- Navigation -->
      <ul class="nav-linkss">
        <li v-for="item in navItems" :key="item.path">
          <router-link
            :to="item.path"
            class="nav-link"
            :class="{ active: $route.path.startsWith(item.path) }"
          >
            {{ $t(item.label) }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "NurseSidebar",
  data() {
    return {
      sidebarVisible: true,
      isMobile: false,
    };
  },
  computed: {
    navItems() {
      return [
        { label: "nurseSidebar.Dashboard", path: "/dashboard" },
        { label: "nurseSidebar.bookings", path: "/nursebookings" },
        { label: "nurseSidebar.earnings", path: "/nurseearnings" },
        { label: "nurseSidebar.reviews", path: "/nursereviews" },
        { label: "nurseSidebar.editProfile", path: "/nurseedit" },
      ];
    },
  },
  mounted() {
    this.checkIsMobile();
    window.addEventListener("resize", this.checkIsMobile);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkIsMobile);
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    checkIsMobile() {
      this.isMobile = window.innerWidth <= 768;
      this.sidebarVisible = !this.isMobile;
    },
    async signOut() {
      try {
        await signOut(getAuth());
        this.$router.push("/signin");
      } catch (error) {
        console.error("Sign out failed:", error);
      }
    },
  },
};
</script>
<style scoped>
.sidebar-toggle {
  display: none;
  position: fixed;
  top: 24px;
  inset-inline-start: 24px;
  z-index: 1000;
  background-color: #19599a;
  color: white;
  border: none;
  font-size: 24px;
  padding: 8px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.toggle-label {
  font-size: 16px;
  color: white;
}
@media (max-width: 768px) {
  .sidebar-toggle {
    display: block;
  }
  .sidebar-container {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 999;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }

  .sidebar-container.sidebar-hidden {
    transform: translateX(-100%);
  }
}

.sidebar-container {
  width: 250px;
  background-color: #19599a;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
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
.nav-linkss {
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
