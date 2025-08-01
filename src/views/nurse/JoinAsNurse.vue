<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '25%' }"></div>
      </div>
      <div class="progress-label">{{ $t("joinAsNurse.step1.progress") }}</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">{{ $t("joinAsNurse.step1.title") }}</h1>
      <p class="form-subtitle">{{ $t("joinAsNurse.step1.subtitle") }}</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-grid">
          <!-- First Name (English) -->
          <div class="input-group">
            <label for="firstNameEn">{{
              $t("joinAsNurse.step1.firstNameEn")
            }}</label>
            <input
              type="text"
              id="firstNameEn"
              v-model="formData.firstNameEn"
              :placeholder="$t('joinAsNurse.step1.firstNameEnPlaceholder')"
              required
              pattern="^[A-Za-z\s]+$"
              title="Only English letters allowed"
            />
          </div>

          <!-- First Name (Arabic) -->
          <div class="input-group">
            <label for="firstNameAr">{{
              $t("joinAsNurse.step1.firstNameAr")
            }}</label>
            <input
              type="text"
              id="firstNameAr"
              v-model="formData.firstNameAr"
              :placeholder="$t('joinAsNurse.step1.firstNameArPlaceholder')"
              required
              pattern="^[\u0600-\u06FF\s]+$"
              title="الاسم يجب أن يكون باللغة العربية فقط"
            />
          </div>
          <!-- Last Name (English) -->
          <div class="input-group">
            <label for="lastNameEn">{{
              $t("joinAsNurse.step1.lastNameEn")
            }}</label>
            <input
              type="text"
              id="lastNameEn"
              v-model="formData.lastNameEn"
              :placeholder="$t('joinAsNurse.step1.lastNameEnPlaceholder')"
              required
              pattern="^[A-Za-z\s]+$"
              title="Only English letters allowed"
            />
          </div>
          <!-- Last Name (Arabic) -->
          <div class="input-group">
            <label for="lastNameAr">{{
              $t("joinAsNurse.step1.lastNameAr")
            }}</label>
            <input
              type="text"
              id="lastNameAr"
              v-model="formData.lastNameAr"
              :placeholder="$t('joinAsNurse.step1.lastNameArPlaceholder')"
              required
              pattern="^[\u0600-\u06FF\s]+$"
              title="اسم العائلة يجب أن يكون باللغة العربية فقط"
            />
          </div>

          <div class="input-group">
            <label for="password">{{ $t("joinAsNurse.step1.password") }}</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              :placeholder="$t('joinAsNurse.step1.passwordPlaceholder')"
              required
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}"
              title="Password must be at least 8 characters long and include uppercase, lowercase letters, and a number."
            />
          </div>

          <!-- Confirm Password -->
          <div class="input-group">
            <label for="confirmPassword">{{
              $t("joinAsNurse.step1.confirmPassword")
            }}</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :placeholder="$t('joinAsNurse.step1.confirmPasswordPlaceholder')"
              required
            />
          </div>

          <!-- Date of Birth -->
          <div class="input-group">
            <label for="dob">{{ $t("joinAsNurse.step1.dob") }}</label>
            <input type="date" id="dob" v-model="formData.dob" required />
          </div>

          <!-- Gender -->
          <div class="input-group">
            <label for="gender">{{ $t("joinAsNurse.step1.gender") }}</label>
            <select id="gender" v-model="formData.gender" required>
              <option value="" disabled selected>
                {{ $t("joinAsNurse.step1.selectGender") }}
              </option>
              <option value="male">{{ $t("joinAsNurse.step1.male") }}</option>
              <option value="female">
                {{ $t("joinAsNurse.step1.female") }}
              </option>
            </select>
          </div>

          <!-- National ID -->
          <div class="input-group">
            <label for="nationalId">
              {{ $t("joinAsNurse.step1.nationalId") }}
            </label>
            <input
              type="text"
              id="nationalId"
              v-model="formData.nationalId"
              :placeholder="$t('joinAsNurse.step1.idPlaceholder')"
              required
            />
          </div>

          <!-- Phone Number -->
          <div class="input-group">
            <label for="phone"> {{ $t("joinAsNurse.step1.phone") }} </label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              :placeholder="$t('joinAsNurse.step1.phonePlaceholder')"
              required
            />
          </div>

          <!-- Email -->
          <div class="input-group">
            <label for="email"> {{ $t("joinAsNurse.step1.email") }} </label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :placeholder="$t('joinAsNurse.step1.emailPlaceholder')"
              required
            />
          </div>

          <!-- City -->
          <div class="input-group">
            <label for="city"> {{ $t("joinAsNurse.step1.city") }} </label>
            <select
              id="city"
              v-model="formData.city"
              @change="formData.area = ''"
              required
            >
              <option value="" disabled>
                {{ $t("joinAsNurse.step1.selectCity") }}
              </option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <!-- Area -->
          <div class="input-group">
            <label for="area"> {{ $t("joinAsNurse.step1.area") }} </label>
            <select
              id="area"
              v-model="formData.area"
              :disabled="!formData.city"
              required
            >
              <option value="" disabled>
                {{ $t("joinAsNurse.step1.selectArea") }}
              </option>
              <option
                v-for="area in areas[formData.city] || []"
                :key="area"
                :value="area"
              >
                {{ area }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">
            {{ $t("joinAsNurse.step1.submit") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
import { cities, areas } from "@/data/locationOptions";

const formData = ref({
  firstNameEn: "",
  firstNameAr: "",
  lastNameEn: "",
  lastNameAr: "",
  dob: "",
  gender: "",
  nationalId: "",
  phone: "",
  email: "",
  city: "",
  area: "",
  password: "",
  confirmPassword: "",
});

// Load saved data
onMounted(() => {
  const savedData = localStorage.getItem("personalData");
  if (savedData) {
    try {
      formData.value = JSON.parse(savedData);
    } catch (e) {
      console.error("Failed to parse saved data:", e);
      localStorage.removeItem("personalData");
    }
  }
});

// Handle submit
const handleSubmit = () => {
  if (!/^[\u0600-\u06FF\s]+$/.test(formData.value.firstNameAr)) {
    alert("الاسم الأول بالعربي يجب أن يحتوي على حروف عربية فقط");
    return;
  }

  if (!/^[A-Za-z\s]+$/.test(formData.value.firstNameEn)) {
    alert("First name (English) must contain only English letters");
    return;
  }

  if (!/^[\u0600-\u06FF\s]+$/.test(formData.value.lastNameAr)) {
    alert("اسم العائلة بالعربي يجب أن يحتوي على حروف عربية فقط");
    return;
  }

  if (!/^[A-Za-z\s]+$/.test(formData.value.lastNameEn)) {
    alert("Last name (English) must contain only English letters");
    return;
  }

  // Password match check
  if (formData.value.password !== formData.value.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Password strength check
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(
      formData.value.password
    )
  ) {
    alert(
      "Password must be at least 8 characters long and include uppercase, lowercase letters, and a number."
    );
    return;
  }
  // Validate national ID
  if (!/^\d{14}$/.test(formData.value.nationalId)) {
    alert("National ID must be 14 digits.");
    return;
  }

  //validate phone number
  if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.value.phone)) {
    alert(
      "Enter a valid Egyptian phone number (11 digits, starting with 010/011/012/015)."
    );
    return;
  }

  // Save and navigate
  localStorage.setItem("personalData", JSON.stringify(formData.value));
  router.push("/secondjoin");
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
.input-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-group select {
  background-image: none;
  padding-right: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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

.submit-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
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
