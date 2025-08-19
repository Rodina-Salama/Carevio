<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '75%' }"></div>
      </div>
      <div class="progress-label">{{ $t("joinAsNurse.step3.progress") }}</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">{{ $t("joinAsNurse.step3.title") }}</h1>
      <p class="form-subtitle">{{ $t("joinAsNurse.step3.subtitle") }}</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <!-- Document Upload Sections -->
        <div class="upload-section">
          <h3 style="color: #555">{{ $t("joinAsNurse.step3.cv") }}</h3>
          <div class="upload-group">
            <input
              type="file"
              id="cv"
              ref="cvInput"
              accept="image/*"
              @change="handleFileUpload('cv', $event)"
              required
            />
            <label for="cv" class="upload-btn">{{
              $t("joinAsNurse.step3.chooseFile")
            }}</label>
            <span class="file-name">{{
              documents.cv ? documents.cv.name : $t("joinAsNurse.step3.noFile")
            }}</span>
          </div>
        </div>

        <div class="upload-section">
          <h3>{{ $t("joinAsNurse.step3.nationalId") }}</h3>
          <div class="upload-grid">
            <div class="upload-group">
              <label>{{ $t("joinAsNurse.step3.frontSide") }}</label>
              <input
                type="file"
                id="idFront"
                ref="idFrontInput"
                accept="image/*"
                @change="handleFileUpload('idFront', $event)"
                required
              />
              <label for="idFront" class="upload-btn">{{
                $t("joinAsNurse.step3.chooseFile")
              }}</label>
              <span class="file-name">{{
                documents.idFront
                  ? documents.idFront.name
                  : $t("thirdjoin.noFile")
              }}</span>
            </div>
            <div class="upload-group">
              <label>{{ $t("joinAsNurse.step3.backSide") }}</label>
              <input
                type="file"
                id="idBack"
                ref="idBackInput"
                accept="image/*"
                @change="handleFileUpload('idBack', $event)"
                required
              />
              <label for="idBack" class="upload-btn">{{
                $t("joinAsNurse.step3.chooseFile")
              }}</label>
              <span class="file-name">{{
                documents.idBack
                  ? documents.idBack.name
                  : $t("thirdjoin.noFile")
              }}</span>
            </div>
          </div>
        </div>

        <div class="upload-section">
          <h3>{{ $t("joinAsNurse.step3.additionalDocs") }}</h3>
          <div class="upload-grid">
            <div class="upload-group">
              <label>{{ $t("joinAsNurse.step3.personalPhoto") }}</label>
              <input
                type="file"
                id="photo"
                ref="photoInput"
                accept="image/*"
                @change="handleFileUpload('photo', $event)"
                required
              />
              <label for="photo" class="upload-btn">{{
                $t("joinAsNurse.step3.chooseFile")
              }}</label>
              <span class="file-name">{{
                documents.photo ? documents.photo.name : $t("thirdjoin.noFile")
              }}</span>
            </div>
            <div class="upload-group">
              <label>{{ $t("joinAsNurse.step3.license") }}</label>
              <input
                type="file"
                id="nursingLicense"
                ref="nursingLicenseInput"
                accept="image/*"
                @change="handleFileUpload('nursingLicense', $event)"
                required
              />
              <label for="nursingLicense" class="upload-btn">{{
                $t("joinAsNurse.step3.chooseFile")
              }}</label>
              <span class="file-name">{{
                documents.nursingLicense
                  ? documents.nursingLicense.name
                  : $t("thirdjoin.noFile")
              }}</span>
            </div>
          </div>
        </div>
        <div class="terms-box">
          <label>
            <input type="checkbox" v-model="agreeToTerms" />
            {{ $t("thirdjoin.terms.label") }}
            <!-- <<< استخدم هذا -->
            <router-link to="/termsandconditions" target="_blank">
              {{ $t("thirdjoin.terms.link") }}
              <!-- <<< و هذا -->
            </router-link>
          </label>

          <p v-if="showError" class="error-text">
            {{ $t("thirdjoin.terms.error") }}
            <!-- <<< و هذا لرسالة الخطأ -->
          </p>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="goBack">
            {{ $t("joinAsNurse.buttons.back") }}
          </button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{
              isSubmitting
                ? $t("joinAsNurse.step3.submitting")
                : $t("joinAsNurse.buttons.submit")
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { onMounted } from "vue";
const agreeToTerms = ref(false); // terms and conditions checkbox
const showError = ref(false); // error message for terms and conditions

onMounted(() => {
  const personalcheck = localStorage.getItem("personalData");
  const professionalcheck = localStorage.getItem("professionalData");

  if (!personalcheck || !professionalcheck) {
    router.push("/join");
  }
});
const CLOUDINARY_UPLOAD_PRESET = "Nurse_information";
const getUploadUrl = () => {
  return "https://api.cloudinary.com/v1_1/dqa1o4xga/image/upload";
};
const router = useRouter();
const isSubmitting = ref(false);

const documents = ref({
  cv: null,
  idFront: null,
  idBack: null,
  photo: null,
  nursingLicense: null,
});

const validateFile = (file, maxSizeMB = 5) => {
  const validImageTypes = ["image/jpeg", "image/png"];

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File too large (max ${maxSizeMB}MB)`);
  }

  if (!validImageTypes.includes(file.type)) {
    throw new Error("Only JPG/PNG image files are allowed");
  }
};

const handleFileUpload = (field, event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    validateFile(file); // كله بقى صورة فقط (5MB max)

    documents.value[field] = file;
  } catch (error) {
    alert(error.message);
    event.target.value = "";
  }
};
const goBack = () => router.push("/secondjoin");

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const url = getUploadUrl(file);

  try {
    const response = await axios.post(url, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
const handleSubmit = async () => {
  if (!agreeToTerms.value) {
    // Terms and Conditions checkbox validation
    showError.value = true;
    return;
  }
  showError.value = false;
  // Prevent multiple submissions
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    // Get data from previous steps
    const personalData = JSON.parse(localStorage.getItem("personalData"));
    const professionalData = JSON.parse(
      localStorage.getItem("professionalData")
    );

    // Ensure the first step was completed
    if (!personalData?.nationalId) {
      throw new Error("Please complete Step 1: Personal Information");
    }

    // Ensure the second step was completed
    if (!professionalData?.licenseNumber) {
      throw new Error("Please complete Step 2: Professional Information");
    }

    const email = personalData.email;
    const password = personalData.password;
    // Create user with email and password in Firebase Authentication
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (authError) {
      // Handle common auth errors
      if (authError.code === "auth/email-already-in-use") {
        throw new Error(
          "Email is already registered. Please use a different email."
        );
      } else {
        throw new Error(`Authentication failed: ${authError.message}`);
      }
    }

    const user = userCredential.user;
    await updateProfile(user, {
      displayName: personalData.firstNameEn,
    });
    await sendEmailVerification(user);

    const documentUrls = {};
    const uploadPromises = [];

    for (const [field, file] of Object.entries(documents.value)) {
      if (!file) continue;

      uploadPromises.push(
        uploadToCloudinary(file).then((url) => {
          documentUrls[field] = {
            url: url,
          };
        })
      );
    }

    await Promise.all(uploadPromises);
    delete personalData.confirmPassword;
    await setDoc(doc(db, "applications", user.uid), {
      type: "nurse",
      personal: personalData,
      professional: professionalData,
      documents: documentUrls,
      status: "Pending",
      createdAt: new Date().toISOString(),
      isVisible: true,
      isBanned: false,
    });
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      password: password,
      type: "nurse",
      profileImage: documentUrls.photo?.url || "",
      fullName: `${personalData.firstNameEn} ${personalData.lastNameEn}`,
      createdAt: new Date().toISOString(),
    });
    localStorage.removeItem("personalData");
    localStorage.removeItem("professionalData");
    router.push("/confirm");
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Submission failed: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
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

.upload-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.upload-section h3 {
  color: #19599a;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.upload-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-group label {
  color: #19599a;
  font-weight: 500;
  font-size: 0.9rem;
}

.upload-btn {
  display: inline-block;
  background-color: #f8f9fa;
  color: #19599a;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.upload-btn:hover {
  background-color: #e9ecef;
  border-color: #ccc;
}

input[type="file"] {
  display: none;
}

.file-name {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload-group label:not(.upload-btn) {
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;

  margin-bottom: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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
  background-color: #e9ecef;
}

.submit-btn {
  background-color: #19599a;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: #67aef5ff;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .registration-container {
    padding: 1rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .upload-grid {
    grid-template-columns: 1fr;
  }
}
.error-text {
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
