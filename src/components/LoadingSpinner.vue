<!-- src/components/LoadingSpinner.vue -->
<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p>{{ t("loading.loading") }}...</p>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #19599a;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #19599a;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
