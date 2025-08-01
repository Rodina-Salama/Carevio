<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '50%' }"></div>
      </div>
      <div class="progress-label">{{ $t("joinAsNurse.step2.progress") }}</div>

      <div class="progress-label">{{ $t("secondjoin.stepLabel") }}</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">{{ $t("joinAsNurse.step2.title") }}</h1>
      <p class="form-subtitle">{{ $t("joinAsNurse.step2.subtitle") }}</p>

      <h1 class="form-title">{{ $t("secondjoin.title") }}</h1>
      <p class="form-subtitle">{{ $t("secondjoin.subtitle") }}</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-grid">
          <!-- Years of Experience -->
          <div class="input-group">
            <label for="experience">{{
              $t("joinAsNurse.step2.experience")
            }}</label>
            <input
              type="number"
              id="experience"
              v-model="formData.experience"
              :placeholder="$t('joinAsNurse.step2.experiencePlaceholder')"
              min="0"
              required
            />
          </div>

          <!-- License Number -->
          <div class="input-group">
            <label for="licenseNumber">{{
              $t("joinAsNurse.step2.license")
            }}</label>
            <input
              type="text"
              id="licenseNumber"
              v-model="formData.licenseNumber"
              :placeholder="$t('joinAsNurse.step2.licensePlaceholder')"
              required
            />
          </div>

          <!-- Price-->
          <div class="input-group">
            <label for="Price">
              {{ $t("joinAsNurse.step2.priceLabel") }}
            </label>

            <label for="price">{{ $t("secondjoin.priceLabel") }}</label>
            <input
              type="text"
              id="price"
              v-model="formData.price"
              :placeholder="$t('joinAsNurse.step2.pricePlaceholder')"
              required
            />
          </div>
          <!-- Available Days -->
          <div class="input-group">
            <label>{{ $t("joinAsNurse.step2.availableDays") }}</label>

            <label>{{ $t("secondjoin.availableDays") }}</label>

            <div class="checkbox-group">
              <div
                class="checkbox-item"
                v-for="(day, index) in availableDays"
                :key="index"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="day"
                    v-model="formData.availableDays"
                  />
                  {{ $t(`data.days.${day}`) }}
                </label>
              </div>
            </div>
          </div>

          <!-- Shifts -->
          <!-- Shifts -->
          <div class="input-group">
            <label>{{ $t("joinAsNurse.step2.shifts") }}</label>

            <label>{{ $t("secondjoin.availableTime") }}</label>

            <div class="checkbox-group">
              <div
                class="checkbox-item"
                v-for="(times, shift) in shiftOptions"
                :key="shift"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="shift"
                    v-model="formData.shifts"
                  />
                  {{ $t(`data.shifts.${shift}`) }}
                  ({{ times[0].from }} - {{ times[times.length - 1].to }})
                </label>
              </div>
            </div>
          </div>

          <!-- Languages -->
          <div class="input-group">
            <label>{{ $t("joinAsNurse.step2.languages") }}</label>
            <label>{{ $t("secondjoin.languages") }}</label>
            <div class="checkbox-group">
              <div
                class="checkbox-item"
                v-for="(lang, index) in languageOptions"
                :key="index"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="lang"
                    v-model="formData.languages"
                  />
                  {{ $t(`data.languages.${lang}`) }}
                </label>
              </div>
            </div>
          </div>
          <!-- Specialization -->
          <div class="input-group">
            <label>{{ $t("joinAsNurse.step2.services") }}</label>

            <label>{{ $t("secondjoin.services") }}</label>

            <div class="checkbox-group">
              <div
                class="checkbox-item"
                v-for="(spec, index) in specializationOptions"
                :key="index"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="spec"
                    v-model="formData.specialization"
                  />
                  {{ $t(`data.specializations.${spec}`) }}
                </label>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="input-group full-width">
            <label for="bio">{{ $t("joinAsNurse.step2.bio") }}</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              :placeholder="$t('joinAsNurse.step2.bioPlaceholder')"
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="goBack">
            {{ $t("joinAsNurse.buttons.back") }}
          </button>
          <button type="submit" class="submit-btn">
            {{ $t("joinAsNurse.buttons.next") }}

            {{ $t("secondjoin.back") }}
          </button>
          <button type="submit" class="submit-btn">
            {{ $t("secondjoin.next") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { shiftOptions } from "@/data/shiftOptions";
import { languageOptions } from "@/data/languageOptions";
import { specializationOptions } from "@/data/specializationOptions";
import { availableDays } from "@/data/availableDays";
const router = useRouter();
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// Form data
const formData = ref({
  experience: "",
  availableDays: [],
  shifts: [],
  languages: [],
  specialization: [],
  licenseNumber: "",
  bio: "",
  price: "",
});

const goBack = () => {
  router.push("/join");
};

const handleSubmit = () => {
  if (formData.value.specialization.length === 0) {
    alert(t("secondjoin.alertSpecialization"));
    return;
  }

  if (formData.value.languages.length === 0) {
    alert(t("secondjoin.alertLanguages"));
    return;
  }

  if (formData.value.shifts.length === 0) {
    alert(t("secondjoin.alertShifts"));
    return;
  }
  const price = parseFloat(formData.value.price);
  if (isNaN(price) || price < 50 || price > 500) {
    alert(t("secondjoin.alertPrice"));
    return;
  }
  const bio = formData.value.bio.trim();
  if (bio.length < 20) {
    alert(t("secondjoin.bioTooShort"));
    return;
  }
  // Store data in localStorage
  localStorage.setItem("professionalData", JSON.stringify(formData.value));
  router.push("/thirdjoin");
};
onMounted(() => {
  const personalData = localStorage.getItem("personalData");
  if (!personalData) {
    router.push("/join");
  }
  const saved = localStorage.getItem("professionalData");
  if (saved) {
    Object.assign(formData.value, JSON.parse(saved));
  }
});
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
  font-weight: 700;
  font-size: 1rem;
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
  color: #333;
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
  background-color: transparent;
  color: #19599a;
  border: 1px solid #19599a;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
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
