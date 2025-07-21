<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '50%' }"></div>
      </div>
      <div class="progress-label">Step 2 of 4 (50%)</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">Professional Experience</h1>
      <p class="form-subtitle">Tell us about your professional background</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-grid">
          <!-- Years of Experience -->
          <div class="input-group">
            <label for="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              v-model="formData.experience"
              placeholder="Enter years of experience"
              min="0"
              required
            />
          </div>

          <!-- License Number -->
          <div class="input-group">
            <label for="licenseNumber">License Number</label>
            <input
              type="text"
              id="licenseNumber"
              v-model="formData.licenseNumber"
              placeholder="Enter your license number"
              required
            />
          </div>

          <!-- Specialization -->
          <div class="input-group">
            <label>Specialization</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="morning"
                  v-model="formData.specialization.morning"
                />
                <label for="morning">Morning</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="evening"
                  v-model="formData.specialization.evening"
                />
                <label for="evening">Evening</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="overnight"
                  v-model="formData.specialization.overnight"
                />
                <label for="overnight">Overnight</label>
              </div>
            </div>
          </div>

          <!-- Languages Spoken -->
          <div class="input-group">
            <label>Languages Spoken</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="english"
                  v-model="formData.languages.english"
                />
                <label for="english">English</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="arabic"
                  v-model="formData.languages.arabic"
                />
                <label for="arabic">Arabic</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="french"
                  v-model="formData.languages.french"
                />
                <label for="french">French</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="german"
                  v-model="formData.languages.german"
                />
                <label for="german">German</label>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="input-group full-width">
            <label for="bio">Bio</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              placeholder="Write your bio..."
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="goBack">Back</button>
          <button type="submit" class="submit-btn">Next</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Form data
const formData = ref({
  experience: "",
  specialization: {
    morning: false,
    evening: false,
    overnight: false,
  },
  languages: {
    english: false,
    arabic: false,
    french: false,
    german: false,
  },
  licenseNumber: "",
  bio: "",
});

const goBack = () => {
  router.push("/join");
};

const handleSubmit = () => {
  // Store data in localStorage
  localStorage.setItem("professionalData", JSON.stringify(formData.value));
  router.push("/thirdjoin");
};
</script>

<style scoped>
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
  background-color: #19599a;
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
}

.form-title {
  color: #19599a;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.form-subtitle {
  color: #6c757d;
  text-align: center;
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.input-group {
  margin: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #19599a;
  font-weight: 500;
  font-size: 0.95rem;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-group textarea {
  resize: vertical;
  min-height: 100px;
}

.input-group input[type="file"] {
  padding: 0.5rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input {
  width: auto;
  margin-right: 0.5rem;
}

.checkbox-item label {
  margin-bottom: 0;
  font-weight: normal;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  background-color: #19599a;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #67aef5ff;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  background-color: #e9ecef;
  color: #495057;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #d1d7dc;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .form-card {
    padding: 1.5rem;
  }
}
</style>
