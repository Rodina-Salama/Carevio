<template>
  <div class="registration-container">
    <!-- Progress Bar -->
    <div class="progress-section">
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: '75%' }"></div>
      </div>
      <div class="progress-label">Step 3 of 4 (75%)</div>
    </div>

    <!-- Form Section -->
    <div class="form-card">
      <h1 class="form-title">Document Uploads</h1>
      <p class="form-subtitle">Please upload all required documents</p>

      <form @submit.prevent="handleSubmit" class="form-content">
        <!-- Document Upload Sections -->
        <div class="upload-section">
          <h3>CV (PDF)</h3>
          <div class="upload-group">
            <input
              type="file"
              id="cv"
              ref="cvInput"
              accept=".pdf"
              @change="handleFileUpload('cv', $event)"
              required
            />
            <label for="cv" class="upload-btn">Choose File</label>
            <span class="file-name">{{
              documents.cv ? documents.cv.name : "No file chosen"
            }}</span>
          </div>
        </div>

        <div class="upload-section">
          <h3>National ID</h3>
          <div class="upload-grid">
            <div class="upload-group">
              <label>Front Side</label>
              <input
                type="file"
                id="idFront"
                ref="idFrontInput"
                accept="image/*,.pdf"
                @change="handleFileUpload('idFront', $event)"
                required
              />
              <label for="idFront" class="upload-btn">Choose File</label>
              <span class="file-name">{{
                documents.idFront ? documents.idFront.name : "No file chosen"
              }}</span>
            </div>
            <div class="upload-group">
              <label>Back Side</label>
              <input
                type="file"
                id="idBack"
                ref="idBackInput"
                accept="image/*,.pdf"
                @change="handleFileUpload('idBack', $event)"
                required
              />
              <label for="idBack" class="upload-btn">Choose File</label>
              <span class="file-name">{{
                documents.idBack ? documents.idBack.name : "No file chosen"
              }}</span>
            </div>
          </div>
        </div>

        <div class="upload-section">
          <h3>Additional Documents</h3>
          <div class="upload-grid">
            <div class="upload-group">
              <label>Personal Photo</label>
              <input
                type="file"
                id="photo"
                ref="photoInput"
                accept="image/*"
                @change="handleFileUpload('photo', $event)"
                required
              />
              <label for="photo" class="upload-btn">Choose File</label>
              <span class="file-name">{{
                documents.photo ? documents.photo.name : "No file chosen"
              }}</span>
            </div>
            <div class="upload-group">
              <label>Criminal Record</label>
              <input
                type="file"
                id="criminalRecord"
                ref="criminalRecordInput"
                accept=".pdf,image/*"
                @change="handleFileUpload('criminalRecord', $event)"
                required
              />
              <label for="criminalRecord" class="upload-btn">Choose File</label>
              <span class="file-name">{{
                documents.criminalRecord
                  ? documents.criminalRecord.name
                  : "No file chosen"
              }}</span>
            </div>
            <div class="upload-group">
              <label>Nursing License</label>
              <input
                type="file"
                id="nursingLicense"
                ref="nursingLicenseInput"
                accept=".pdf,image/*"
                @change="handleFileUpload('nursingLicense', $event)"
                required
              />
              <label for="nursingLicense" class="upload-btn">Choose File</label>
              <span class="file-name">{{
                documents.nursingLicense
                  ? documents.nursingLicense.name
                  : "No file chosen"
              }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="back-btn" @click="goBack">Back</button>
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? "Submitting..." : "Submit Application" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db, storage } from "@/firebase"; // Updated import path
import { doc, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes } from "firebase/storage";

const router = useRouter();
const isSubmitting = ref(false);

const documents = ref({
  cv: null,
  idFront: null,
  idBack: null,
  photo: null,
  criminalRecord: null,
  nursingLicense: null,
});

const validateFile = (file, type, maxSizeMB = 5) => {
  const validTypes = {
    pdf: ["application/pdf"],
    image: ["image/jpeg", "image/png"],
  };

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File too large (max ${maxSizeMB}MB)`);
  }

  if (type === "pdf" && !validTypes.pdf.includes(file.type)) {
    throw new Error("Only PDF files are allowed");
  }

  if (type === "image" && !validTypes.image.includes(file.type)) {
    throw new Error("Only JPG/PNG images are allowed");
  }
};

const handleFileUpload = (field, event) => {
  try {
    const file = event.target.files[0];
    if (!file) return;

    switch (field) {
      case "cv":
      case "criminalRecord":
      case "nursingLicense":
        validateFile(file, "pdf", 10);
        break;
      default:
        validateFile(file, "image", 5);
    }

    documents.value[field] = file;
  } catch (error) {
    alert(error.message);
    event.target.value = "";
  }
};

const goBack = () => router.push("/secondjoin");

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const personalData = JSON.parse(localStorage.getItem("personalData"));
    const professionalData = JSON.parse(
      localStorage.getItem("professionalData")
    );

    if (!personalData?.nationalId) {
      throw new Error("Please complete Step 1: Personal Information");
    }

    if (!professionalData?.licenseNumber) {
      throw new Error("Please complete Step 2: Professional Information");
    }

    const documentUrls = {};
    const uploadPromises = [];

    for (const [field, file] of Object.entries(documents.value)) {
      if (!file) continue;

      const fileExt =
        field === "cv" ? ".pdf" : file.type.includes("image") ? ".jpg" : ".pdf";
      const filePath = `documents/${
        personalData.nationalId
      }/${field}_${Date.now()}${fileExt}`;

      uploadPromises.push(
        uploadBytes(storageRef(storage, filePath), file).then(() => {
          documentUrls[field] = filePath;
        })
      );
    }

    await Promise.all(uploadPromises);

    await setDoc(doc(db, "applications", personalData.nationalId), {
      personal: personalData,
      professional: professionalData,
      documents: documentUrls,
      status: "under_review",
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

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.back-btn {
  background-color: #f8f9fa;
  color: #495057;
  padding: 0.75rem 1.5rem;
  border: none;
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
  background-color: #134980;
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
</style>
