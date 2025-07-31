<template>
  <div class="registration-container">
    <!-- Progress Bar (100%) -->
    <div class="progress-section">
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: '100%', backgroundColor: '#4CAF50' }"
        ></div>
      </div>
      <div class="progress-label">{{ $t("confirmnurse.progress") }}</div>
    </div>

    <!-- Confirmation Card -->
    <div class="form-card">
      <div class="confirmation-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#4CAF50"
          width="64"
          height="64"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      </div>
      <h1 class="form-title">{{ $t("confirmnurse.title") }}</h1>
      <p class="form-subtitle">
        {{ $t("confirmnurse.subtitle") }}
      </p>

      <div class="confirmation-actions">
        <button @click="goToHome" class="submit-btn">
          {{ $t("confirmnurse.ok") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Clear all stored form data when this page loads
onMounted(() => {
  localStorage.removeItem("personalData");
  localStorage.removeItem("professionalData");
  console.log("Cleared form data from localStorage");
});

const goToHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* Reuse styles from previous pages */
.registration-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.progress-section {
  margin-bottom: 2.5rem;
}

.progress-track {
  height: 12px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-label {
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-title {
  color: #2e7d32; /* Darker green for text */
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.confirmation-icon {
  margin-bottom: 1.5rem;
}

.confirmation-actions {
  margin-top: 2rem;
}

.submit-btn {
  background-color: #4caf50; /* Green */
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #3e8e41; /* Darker green on hover */
}

@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem;
  }
}
</style>
