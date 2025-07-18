<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '25%' }"></div>
      </div>
      <div class="progress-label">Step 1 of 4 (25%)</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">Personal Information</h1>
      <p class="form-subtitle">Please provide your personal details</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <div class="form-grid">
          <!-- First Name -->
          <div class="input-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              placeholder="Enter your first name"
              required
            />
          </div>

          <!-- Last Name -->
          <div class="input-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              placeholder="Enter your last name"
              required
            />
          </div>

          <!-- Date of Birth -->
          <div class="input-group">
            <label for="dob">Date of Birth</label>
            <input type="date" id="dob" v-model="formData.dob" required />
          </div>

          <!-- Gender -->
          <div class="input-group">
            <label for="gender">Gender</label>
            <select id="gender" v-model="formData.gender" required>
              <option value="" disabled selected>Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- National ID -->
          <div class="input-group">
            <label for="nationalId">National ID Number</label>
            <input
              type="text"
              id="nationalId"
              v-model="formData.nationalId"
              placeholder="Enter your national ID"
              required
            />
          </div>

          <!-- Phone Number -->
          <div class="input-group">
            <label for="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <!-- Email -->
          <div class="input-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- City -->
          <div class="input-group">
            <label for="city">City</label>
            <select
              id="city"
              v-model="formData.city"
              @change="formData.area = ''"
              required
            >
              <option value="" disabled selected>Select your city</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>

          <!-- Area -->
          <div class="input-group">
            <label for="area">Area</label>
            <select
              id="area"
              v-model="formData.area"
              :disabled="!formData.city"
              required
            >
              <option value="" disabled selected>Select your area</option>
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
            Continue to Professional Info
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

// Form data with default empty values
const formData = ref({
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  nationalId: "",
  phone: "",
  email: "",
  city: "",
  area: "",
});

// Location data
const cities = ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan"];
const areas = {
  Cairo: ["Downtown", "Maadi", "Zamalek", "Nasr City"],
  Alexandria: ["Miami", "Stanley", "Sidi Gaber", "Smouha"],
  Giza: ["Dokki", "Mohandessin", "Haram", "6th of October"],
  Luxor: ["Karnak", "Luxor City"],
  Aswan: ["Aswan City", "Elephantine Island"],
};

// Load saved data when component mounts
onMounted(() => {
  const savedData = localStorage.getItem("personalData");
  if (savedData) {
    try {
      formData.value = JSON.parse(savedData);
    } catch (e) {
      console.error("Failed to parse saved data:", e);
      localStorage.removeItem("personalData"); // Clear corrupted data
    }
  }
});

const handleSubmit = () => {
  // Validate required fields before proceeding
  if (
    !formData.value.firstName ||
    !formData.value.lastName ||
    !formData.value.nationalId
  ) {
    alert("Please fill in all required fields");
    return;
  }

  // Save to localStorage
  localStorage.setItem("personalData", JSON.stringify(formData.value));

  // Navigate to next step
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
