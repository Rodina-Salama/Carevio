<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <GuestNavbar v-if="!userType" />
    <UserNavbar v-else-if="userType === 'user'" />
    <NurseNavbar v-else-if="userType === 'nurse'" />
    <button @click="toggleTheme" class="theme-toggle-btn">
      {{ isDarkMode ? "☀️ Light" : "🌙 Dark" }}
    </button>
    <router-view />
    <chat-bot></chat-bot>
    <AppFooter v-if="!isNurseRoute" />
  </div>
</template>

<script>
import GuestNavbar from "@/components/navbar/GuestNavbar.vue";
import UserNavbar from "@/components/navbar/UserNavbar.vue";
import NurseNavbar from "@/components/navbar/NurseNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import ChatBot from "@/components/ChatBot.vue";
import { useUserStore } from "@/stores/userStore";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "App",
  components: {
    GuestNavbar,
    UserNavbar,
    NurseNavbar,
    AppFooter,
    ChatBot,
  },
  setup() {
    const userStore = useUserStore();
    const isUserTypeLoaded = computed(
      () => userStore.firebaseUser !== null || userStore.type !== null
    );
    const userType = computed(() => userStore.type);
    const route = useRoute();
    const isNurseRoute = computed(
      () =>
        route.path.startsWith("/nurse") ||
        route.path.startsWith("/dashboard") ||
        route.path.startsWith("/booking")
    );

    const isDarkMode = ref(false);

    onMounted(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        isDarkMode.value = savedTheme === "dark";
        document.documentElement.classList.toggle("dark", isDarkMode.value);
      }
      const html = document.documentElement;
      html.setAttribute("dir", locale.value === "ar" ? "rtl" : "ltr");
      html.setAttribute("lang", locale.value);

      onAuthStateChanged(auth, async (user) => {
        if (user && !userStore.firebaseUser) {
          await userStore.fetchUserData(user);
        }
      });
    });
    const { locale } = useI18n();

    watch(locale, (newLang) => {
      const html = document.documentElement;
      html.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
      html.setAttribute("lang", newLang);
    });

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDarkMode.value);
    };

    return {
      userType,
      isUserTypeLoaded,
      isNurseRoute,
      isDarkMode,
      toggleTheme,
    };
  },
};
</script>

<style>
:root {
  /* Light theme variables */
  --bg-color: #ffffff;
  --text-color: #000000;
  --button-color: #19599a;
  --card-bg: #ffffff;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --border-color: #e0e0e0;
  --input-bg: #f8f9fa;
  --nav-bg: #ffffff;
  --nav-text-color: #000000;
  --footer-bg: #f8f9fa;
  --section-bg: #f8f9fa;
  --hover-bg: #f0f0f0;
  --primary-color: #19599a;
  --secondary-color: #009acb;
  --text-muted: #6c757d;
}

:root.dark {
  /* Dark theme variables */
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --button-color: #009acb;
  --card-bg: #1e1e1e;
  --card-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  --border-color: #333333;
  --input-bg: #2d2d2d;
  --nav-bg: #1a1a1a;
  --nav-text-color: #ffffff;
  --footer-bg: #1a1a1a;
  --section-bg: #1e1e1e;
  --hover-bg: #333333;
  --primary-color: #009acb;
  --secondary-color: #4a6fa5;
  --text-muted: #a0a0a0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  font-family: "Cairo", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.theme-toggle-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background-color: var(--button-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* Navbar specific styles */
nav {
  background-color: var(--nav-bg) !important;
  transition: background-color 0.3s;
}

/* Dropdown menu styles */
.dropdown-menu {
  background-color: var(--bg-color) !important;
  border-color: var(--border-color) !important;
}

.dropdown-menu a,
.dropdown-menu button {
  color: var(--nav-text-color) !important;
  background-color: var(--card-bg) !important;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: var(--hover-bg) !important;
}

/* Dark mode overrides for all components */
.dark-mode .who-we-are,
.dark-mode .what-we-offer,
.dark-mode .step-card,
.dark-mode .card,
.dark-mode .contact-container,
.dark-mode .why-choose,
.dark-mode .feature,
.dark-mode .testimonials-section,
.dark-mode .services-section,
.dark-mode .testimonial-card,
.dark-mode .service-card,
.dark-mode .login-container,
.dark-mode .login-right,
.dark-mode .profile-container,
.dark-mode .profile-card,
.dark-mode .form-card,
.dark-mode .registration-container {
  background-color: var(--card-bg) !important;
  color: var(--text-color) !important;
}

.dark-mode .text h2,
.dark-mode .offer-content h2,
.dark-mode .how-it-works h2,
.dark-mode .contact-header h2,
.dark-mode .section-title,
.dark-mode .form-title,
.dark-mode h1,
.dark-mode h2,
.dark-mode h3 {
  color: var(--secondary-color) !important;
}

.dark-mode .text p,
.dark-mode .offer-content p,
.dark-mode .feature p,
.dark-mode .service-card p,
.dark-mode .testimonial-content,
.dark-mode .description,
.dark-mode .contact-header p {
  color: var(--text-color) !important;
}

.dark-mode input,
.dark-mode textarea,
.dark-mode select,
.dark-mode .form-group input,
.dark-mode .info-value {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

.dark-mode .votes,
.dark-mode .location,
.dark-mode .text-muted {
  color: var(--text-muted) !important;
}

.dark-mode .spec {
  background: var(--hover-bg) !important;
  color: var(--text-color) !important;
}
.dark-mode .hamburger .bar {
  background-color: white;
}
/* Mobile menu styles */
.dark-mode .navbar-collapse {
  background-color: var(--nav-bg) !important;
}

.dark-mode .navbar-toggler-icon {
  filter: invert(1) brightness(2);
}

/* Footer styles */
.dark-mode footer {
  background-color: var(--footer-bg) !important;
  color: var(--text-color) !important;
}

/* Chatbot styles */
.dark-mode .chatbot-widget:not(.open) {
  background: var(--button-color) !important;
}

.dark-mode .chatbot-header {
  background: var(--button-color) !important;
}

.dark-mode .chatbot-body {
  background: var(--card-bg) !important;
}

.dark-mode .chatbot-message.bot {
  background: var(--section-bg) !important;
  color: var(--text-color) !important;
}

.dark-mode .chatbot-message.user {
  background: var(--button-color) !important;
}

.dark-mode .chatbot-input {
  background: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}
.dark-mode .register-page {
  background-color: #000000 !important;
}

.dark-mode .register-container {
  background: #1a1a1a !important;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.08) !important;
}

.dark-mode .register-image {
  background: #121212 !important;
}

.dark-mode .form-title {
  color: #ffffff !important;
}

.dark-mode .form-group label {
  color: #e0e0e0 !important;
}

.dark-mode .form-group input {
  background-color: #2d2d2d !important;
  border-color: #333333 !important;
  color: #ffffff !important;
}

.dark-mode .login-link {
  color: #a0a0a0 !important;
}

.dark-mode .success-text {
  color: #e0e0e0 !important;
}

.dark-mode .success-note {
  color: #a0a0a0 !important;
}

/* Change password page dark mode */
.dark-mode .change-password {
  background: #000000 !important;
}

.dark-mode .container {
  background: #1a1a1a !important;
  /*box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1) !important;*/
}

.dark-mode .back-btn-top {
  background-color: #4a4a4a !important;
}

.dark-mode .back-btn-top:hover {
  background-color: #3a3a3a !important;
}

.dark-mode h2 {
  color: #ffffff !important;
}

.dark-mode label {
  color: #e0e0e0 !important;
}

.dark-mode input[type="password"] {
  background-color: #2d2d2d !important;
  border-color: #333333 !important;
  color: #ffffff !important;
}

.dark-mode .why-choose {
  background: linear-gradient(to bottom, #000000, #121212) !important;
}
.dark-mode .page-container {
  background-color: #000000 !important;
}
.dark-mode .find-account-container {
  background-color: #1a1a1a !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1) !important;
}

.dark-mode .find-account-container h2 {
  color: #ffffff !important;
}
.dark-mode .nurse-profile-container {
  background-color: #000000 !important;
}
.dark-mode .nurse-profile-page {
  background-color: #000000;
}

:root.dark .dashboard-container {
  background-color: #121212;
}

:root.dark .main-content {
  background-color: #121212;
  color: #e0e0e0;
}

:root.dark .page-title {
  color: #ffffff;
}

:root.dark .card {
  background-color: #1e1e1e;
  border: 1px solid #333333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:root.dark .card.highlight {
  background-color: #1a4b8c;
  border-color: #2a5b9c;
}

:root.dark .card h3 {
  color: #a6a0a0ff;
}

:root.dark .value {
  color: #ffffff;
}

:root.dark .review-time {
  color: #a0a0a0;
}

:root.dark .review-comment {
  color: #e0e0e0;
}

:root.dark .action-btn {
  background-color: #1a4b8c;
}

:root.dark .action-btn:hover {
  background-color: #67aef5ff;
}
/* Dark Mode Calendar Styles */
:root.dark .main-content {
  background: #121212;
}

:root.dark .title {
  color: #ffffff;
}

:root.dark .subtitle {
  color: #a0a0a0;
}

:root.dark .calendar-container,
:root.dark .availability-settings {
  background: #1e1e1e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

:root.dark .calendar-header {
  color: #e0e0e0;
}

:root.dark .calendar-header button {
  background-color: #1a4b8c;
}

:root.dark .calendar-header button:hover {
  background-color: #144a84;
}

:root.dark .day {
  color: #a0a0a0;
}

:root.dark .date {
  background: #2d2d2d;
  color: #e0e0e0;
}

:root.dark .date:hover {
  background: #333;
  color: #ffffff;
}

:root.dark .date.selected {
  background: linear-gradient(to right, #1a4b8c, #144a84);
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

:root.dark input,
:root.dark select {
  background: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

:root.dark .save-btn {
  background-color: #2e7d32;
}

:root.dark .save-btn:hover {
  background-color: #1b5e20;
}
/* Dark Mode Bookings Dashboard */
:root.dark .main-content {
  background-color: #121212;
}

:root.dark .title {
  color: #ffffff;
}

:root.dark .no-bookings {
  color: #a0a0a0;
}

:root.dark .booking-card {
  background: #1e1e1e;
  border: 1px solid #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

:root.dark .booking-card:hover {
  background: #252525;
}

:root.dark .client-name {
  color: #e0e0e0;
}

:root.dark .address,
:root.dark .service {
  color: #a0a0a0;
}

/* Dark Mode View Button */
:root.dark .view-btn {
  background-color: #1a4b8c;
  color: white;
  border: 1px solid #2a5b9c;
}

:root.dark .view-btn:hover {
  background-color: #67aef5ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 152, 203, 0.3);
}

:root.dark .view-btn:active {
  background-color: #00658c;
  transform: translateY(0);
}

/* Optional hover effect for client image */
:root.dark .client-img {
  filter: brightness(0.9);
}

:root.dark .booking-card:hover .client-img {
  filter: brightness(1.1);
}
/* Dark Mode Dashboard Styles */
:root.dark .dashboard-container,
:root.dark .main-content {
  background: #121212;
}

:root.dark .title {
  color: #ffffff;
}

:root.dark .card {
  background: #1e1e1e;
  border-color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

:root.dark .card p {
  color: #a0a0a0;
}

:root.dark .card h2 {
  color: #4a90e2; /* Lighter blue for better visibility */
}

:root.dark .transaction-table {
  background: #1e1e1e;
  border-color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

:root.dark .transaction-table h3 {
  color: #ffffff;
}

:root.dark table {
  color: #e0e0e0;
}

:root.dark thead {
  background: #252525;
}

:root.dark th,
:root.dark td {
  border-bottom-color: #333;
}

:root.dark .paid-status {
  background-color: #1e3b1e;
  color: #4caf50;
}

:root.dark tr:hover {
  background-color: #252525;
}

:root.dark .summary-cards .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
/* Dark Mode Reviews Page */
:root.dark .reviews-page,
:root.dark .content {
  background: #121212;
}

:root.dark .title {
  color: #ffffff;
}

:root.dark .subtitle {
  color: #a0a0a0;
}

:root.dark .review-card {
  background: #1e1e1e;
  border-color: #333;
}

:root.dark .name {
  color: #e0e0e0;
}

:root.dark .time {
  color: #888;
}

:root.dark .stars .star {
  color: #444;
}

:root.dark .stars .filled {
  color: #fcb103;
}

:root.dark .comment {
  color: #d0d0d0;
}

/* Additional dark mode enhancements */
:root.dark .review-card:hover {
  background: #252525;
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

:root.dark .avatar {
  border: 2px solid #333;
}

:root.dark .review-header {
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
/* Dark Mode Nurse Profile */
:root.dark .nurse-profile-container {
  background-color: #121212;
}

:root.dark .nurse-profile-page {
  background-color: #1e1e1e;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

:root.dark .nurse-image {
  background: #2d2d2d;
  border-color: #444;
}

:root.dark .nurse-name {
  color: #ffffff;
}

:root.dark .nurse-location {
  color: #a0a0a0;
}

:root.dark .price-label {
  color: #e0e0e0;
}

:root.dark .price-value {
  color: #4a90e2;
}

:root.dark .action-button {
  background-color: #1a4b8c;
}

:root.dark .action-button:hover {
  background-color: #67aef5ff;
}

:root.dark .section-title,
:root.dark .services-section h4 {
  color: #ffffff;
}

:root.dark .section-text {
  color: #d0d0d0;
}

:root.dark .service-chip {
  background: #2d2d2d;
  color: #e0e0e0;
  border-color: #444;
}

/* Dark mode hover effects */
:root.dark .service-chip:hover {
  background: #333;
}

:root.dark .action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 152, 203, 0.2);
}

/* Keep responsive styles the same, just with dark colors */
@media (max-width: 767px) {
  :root.dark .nurse-profile-page {
    background-color: #1e1e1e;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  :root.dark .nurse-profile-page {
    background-color: #1e1e1e;
  }
}
/* Dark Mode Bookings Page */
:root.dark .my-bookings-page {
  background-color: #121212;
  color: #e0e0e0;
}

:root.dark h1 {
  color: #ffffff;
}

:root.dark h2 {
  color: #d0d0d0;
}

:root.dark .booking-card {
  background: #1e1e1e;
  border-color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

:root.dark .booking-info p {
  color: #b0b0b0;
}

:root.dark .booking-info .date {
  color: #ffffff;
}

:root.dark button {
  background-color: #1a4b8c;
  color: #ffffff;
}

:root.dark button:hover {
  background-color: #67aef5ff;
}

/* Dark Mode Modal Styles */
:root.dark .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

:root.dark .modal-box {
  background: #1e1e1e;
  border: 1px solid #333;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
}

:root.dark .close-btn,
:root.dark .custom-close-btn {
  color: #a0a0a0;
}

:root.dark .modal-box h3,
:root.dark .modal-box h2 {
  color: #ffffff;
}

:root.dark .star {
  color: #444;
}

:root.dark .star.active {
  color: #ffc107;
}

:root.dark .modal-box textarea {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

/* Additional dark mode enhancements */
:root.dark .booking-card:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

:root.dark .modal-box button {
  background-color: #1a4b8c;
}

:root.dark .modal-box button:hover {
  background-color: #67aef5ff;
}

:root.dark .star-rating {
  color: #ffd700;
}
:root.dark .edit-profile-container {
  background-color: #121212;
}

:root.dark .form-card {
  background-color: #1e1e1e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}
:root.dark .bookings-table th,
:root.dark .bookings-table td {
  border-color: #444;
}

:root.dark .bookings-table th {
  background-color: #252525;
  color: #e0e0e0;
}

:root.dark .bookings-table {
  color: #e0e0e0;
}

:root.dark .filter-tabs button {
  background: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

:root.dark .filter-tabs button:hover {
  background: #333;
}

:root.dark .filter-tabs button.active {
  background: #1a4b8c;
  color: #fff;
  border-color: #1a4b8c;
}
:root.dark .comment {
  color: #d0d0d0;
}

:root.dark .filter-buttons button {
  background: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

:root.dark .filter-buttons button:hover {
  background: #333;
}

:root.dark .filter-buttons button.active {
  background: #1a4b8c;
  color: #fff;
  border-color: #1a4b8c;
}
/* Dark Mode Styles */
:root.dark .booking-details {
  background: #1e1e1e;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  border: 1px solid #333; /* Optional subtle border */
}

:root.dark .booking-details li {
  color: #d0d0d0;
}

:root.dark .booking-details strong {
  color: #ffffff; /* Make labels stand out more */
}
:root.dark .booking-details li:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
:root.dark .dashboard-container {
  background-color: #121212;
}

:root.dark .main-content {
  background-color: #1e1e1e;
}

:root.dark .title {
  color: #ffffff;
}

:root.dark .no-bookings {
  color: #9e9e9e;
}

/* Booking Cards */
:root.dark .booking-card {
  background: #2d2d2d;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

:root.dark .booking-card:hover {
  background-color: #333;
}

:root.dark .client-name {
  color: #e0e0e0;
}

:root.dark .address,
:root.dark .service {
  color: #b0b0b0;
}

:root.dark .view-btn {
  background-color: #1a4b8c;
  color: #ffffff;
}

:root.dark .booking-card:hover .view-btn {
  background-color: #67aef5ff;
  color: #ffffff;
  border: 1px solid #1565c0;
}

/* Tables */
:root.dark .bookings-table {
  border-color: #444;
}

:root.dark .bookings-table th,
:root.dark .bookings-table td {
  border-color: #444;
  color: #e0e0e0;
}

:root.dark .bookings-table th {
  background-color: #252525;
  color: #ffffff;
}

:root.dark .bookings-table tr {
  background-color: #2d2d2d;
}

:root.dark .bookings-table tr:hover {
  background-color: #333;
}

/* Filter Tabs */
:root.dark .filter-tabs button {
  background: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

:root.dark .filter-tabs button:hover {
  background: #333;
}

:root.dark .filter-tabs button.active {
  background: #1a4b8c;
  color: #ffffff;
  border-color: #1a4b8c;
}

/* Responsive Table */
@media (max-width: 768px) {
  :root.dark .bookings-table tr {
    background: #2d2d2d;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }

  :root.dark .bookings-table td {
    border-bottom-color: #444;
  }
}

/* Additional Dark Mode Enhancements */
:root.dark .time-filters {
  color: #e0e0e0;
}

:root.dark ::placeholder {
  color: #9e9e9e;
}

:root.dark input,
:root.dark select {
  background-color: #2d2d2d;
  color: #e0e0e0;
  border-color: #444;
}
:root.dark .contact-infos {
  background: #49494aff; /* Dark slate blue background */
  border: 1px solid #49494aff; /* Subtle border */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
/* Dark mode styles for info-item labels */
:root.dark .info-item span:first-child {
  font-weight: 600;
  color: #a0aec0; /* Light gray-blue for better readability */
  margin-right: 0.5rem; /* Added spacing between label and value */
}

/* Dark mode styles for info-item values */
:root.dark .info-item span:last-child {
  color: #e2e8f0; /* Bright white for values */
}
:root.dark .review-text {
  color: #e0e0e0;
  font-size: 15.5px;
  line-height: 1.6;
  margin-bottom: 0;
  margin-left: 4px;
  opacity: 0.9;
}
/* Dark Mode Popup Styles */
:root.dark .success-popup {
  background: rgba(0, 0, 0, 0.8); /* Darker overlay for better contrast */
}

:root.dark .popup-content {
  background: #404346ff; /* Dark slate background */
  border: 1px solid #4a5568; /* Subtle border */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); /* Stronger shadow for depth */
}

:root.dark .popup-content h3 {
  color: #f8fafc; /* Bright white for headings */
}

:root.dark .popup-content p {
  color: #cbd5e0; /* Light gray for body text */
}

:root.dark .popup-icon {
  background: #38a169; /* Slightly different green for better dark mode visibility */
  box-shadow: 0 0 0 8px rgba(56, 161, 105, 0.2); /* Glow effect */
}

:root.dark .popup-btn {
  background: #38a169;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(56, 161, 105, 0.4);
}

:root.dark .popup-btn:hover {
  background: #2f855a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(56, 161, 105, 0.5);
}

:root.dark .popup-progress {
  background: #404346ff;
}

:root.dark .popup-progress::after {
  background: #38a169;
}

@keyframes progressBar {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

/* Optional: Add close button styling */
:root.dark .popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  transition: color 0.2s ease;
}

:root.dark .popup-close:hover {
  color: #ffffff;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  :root.dark .popup-content {
    padding: 1.8rem;
    border-radius: 12px;
  }

  :root.dark .popup-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 1.2rem;
  }
}
/* Dark Mode Modal Styles */
:root.dark .modal-overlay {
  background-color: rgba(0, 0, 0, 0.7); /* Darker overlay for better focus */
  backdrop-filter: blur(4px); /* Adds subtle blur effect */
}

:root.dark .modal-content {
  background-color: #2d3748; /* Dark slate background */
  border: 1px solid #4a5568; /* Subtle border */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); /* Stronger shadow */
}

:root.dark .modal-content .success-title {
  color: #48bb78; /* Softer green for dark mode */
  text-shadow: 0 0 8px rgba(72, 187, 120, 0.2); /* Glow effect */
}

:root.dark .modal-content .success-text,
:root.dark .modal-content .success-note {
  color: #e2e8f0; /* Light gray for readability */
}

:root.dark .modal-content .success-note {
  opacity: 0.9; /* Slightly muted */
}

:root.dark .modal-content .success-note button {
  background-color: #3182ce; /* Brighter blue */
  color: white;
  transition: all 0.2s ease;
}

:root.dark .modal-content .success-note button:hover {
  background-color: #67aef5ff; /* Darker blue on hover */
  transform: translateY(-1px);
}

/* Success icon styling */
:root.dark .modal-content .success-icon svg {
  filter: drop-shadow(0 0 6px rgba(72, 187, 120, 0.4));
}

/* Close button styling */
:root.dark .modal-close {
  color: #a0aec0; /* Muted color */
  transition: color 0.2s ease;
}

:root.dark .modal-close:hover {
  color: #ffffff; /* Bright on hover */
}

/* Responsive adjustments */
@media (max-width: 480px) {
  :root.dark .modal-content {
    padding: 25px;
    border-radius: 10px;
  }

  :root.dark .modal-content .success-title {
    font-size: 22px;
  }
}
:root.dark .chatbot-container {
  background: #3f3f3fff !important;
  color: #e0e0e0 !important;
}
:root.dark .back-btn {
  color: #1a4b8c;
  background-color: transparent;
}

:root.dark .back-btn:hover {
  color: #67aef5ff;
  background-color: transparent;
}
:root.dark .nav-links a {
  color: #ffffff;
}
:root.dark .reset-btn {
  background-color: transparent;
}
:root.dark .back-btn {
  color: #ffffff;
}
:root.dark .btn.outline {
  color: #ffffff;
}
:root.dark .changePassword {
  text-rendering: auto;
  color: buttontext;
  display: inline-block;
  text-align: center;
  cursor: default;
  box-sizing: border-box;
  background-color: buttonface;
  padding-block: 1px;
  padding-inline: 6px;
  border-width: 2px;
  border-style: outset;
  border-color: buttonborder;
  border-image: initial;
}
:root.dark .lang-circle-btn {
  background-color: #0f355b;
}
</style>
