<template>
  <div class="edit-profile">
    <NurseSidebar />
    <LoadingSpinner v-if="loading" class="loading-wrapper" />

    <div v-else class="form-container">
      <h2 class="title">{{ $t("nurseEdit.title") }}</h2>

      <!-- Profile Picture -->
      <div class="form-group">
        <label class="form-label">{{ $t("nurseEdit.profilePicture") }}</label>
        <div class="profile-picture">
          <img
            :src="nurse.documents.photo.url || defaultAvatar"
            class="avatar"
          />
          <div class="btns">
            <input type="file" @change="uploadPhoto" />
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div class="form-group bio-group">
        <label class="form-label">{{ $t("nurseEdit.bio") }}</label>
        <textarea
          v-model="nurse.professional.bio"
          :placeholder="$t('nurseEdit.enterHere')"
          class="input-bio"
        ></textarea>
      </div>

      <!-- Pricing -->
      <div class="form-group">
        <label class="form-label">{{ $t("secondjoin.priceLabel") }}</label>
        <div class="pricing-field">
          <input
            v-model.number="nurse.professional.price"
            type="number"
            class="input small"
            placeholder="100"
          />
          <span class="unit">{{ $t("nurseEdit.unit") }}</span>
        </div>
      </div>

      <!-- Government & Area -->
      <div class="form-group row">
        <div class="col">
          <label class="form-label">{{ $t("nurseEdit.city") }}</label>
          <select v-model="nurse.personal.city" class="input">
            <option v-for="city in cities" :key="city" :value="city">
              {{ $t(`data.cities.${city}`) }}
            </option>
          </select>
        </div>
        <div class="col">
          <label class="form-label">{{ $t("nurseEdit.area") }}</label>
          <select v-model="nurse.personal.area" class="input">
            <option
              v-for="area in areas[nurse.personal.city]"
              :key="area"
              :value="area"
            >
              {{ $t(`data.areas.${area}`) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Services -->
      <div class="form-group">
        <label class="form-label">{{ $t("nurseEdit.services") }}</label>
        <div class="services">
          <label v-for="service in specializationOptions" :key="service">
            <input
              type="checkbox"
              :value="service"
              v-model="nurse.professional.specialization"
            />
            {{ $t(`data.specializations.${service}`) }}
          </label>
        </div>
      </div>

      <!-- Available Days -->
      <div class="form-group">
        <label class="form-label">{{ $t("nurseEdit.availableDays") }}</label>
        <div class="services">
          <label v-for="day in availableDays" :key="day">
            <input
              type="checkbox"
              :value="day"
              v-model="nurse.professional.availableDays"
            />
            {{ $t(`data.days.${day}`) }}
          </label>
        </div>
      </div>

      <!-- Languages -->
      <div class="form-group">
        <label class="form-label">{{ $t("nurseEdit.languages") }}</label>
        <div class="services">
          <label v-for="lang in languageOptions" :key="lang">
            <input
              type="checkbox"
              :value="lang"
              v-model="nurse.professional.languages"
            />
            {{ $t(`data.languages.${lang}`) }}
          </label>
        </div>
      </div>

      <!-- Available shifts -->
      <div class="form-group">
        <label class="form-label">{{ $t("nurseEdit.availableTime") }}</label>
        <div class="services">
          <div
            class="checkbox-item"
            v-for="(times, shift) in shiftOptions"
            :key="shift"
          >
            <label>
              <input
                type="checkbox"
                :value="shift"
                v-model="nurse.professional.shifts"
              />
              {{ $t(`data.shifts.${shift}`) }}
              ({{ times[0].from }} - {{ times[times.length - 1].to }})
            </label>
          </div>
        </div>
      </div>
      <!-- Profile Visibility -->
      <div class="form-group switch-group">
        <label class="form-label">{{
          $t("nurseEdit.profileVisibility")
        }}</label>
        <label class="switch">
          <input type="checkbox" v-model="nurse.isVisible" />
          <span class="slider"></span>
        </label>
      </div>
      <div class="actions-container">
        <button @click="changePassword" class="changePassword">
          {{ $t("nurseEdit.changePassword") }}
        </button>
      </div>
      <!-- Save Button -->
      <button class="btn-save" @click="saveProfile">
        {{ $t("nurseEdit.save") }}
      </button>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { specializationOptions } from "@/data/specializationOptions";
import { shiftOptions } from "@/data/shiftOptions";
import { cities, areas } from "@/data/locationOptions";
import { languageOptions } from "@/data/languageOptions";
import { availableDays } from "@/data/availableDays";
import { onAuthStateChanged } from "firebase/auth";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
export default {
  components: {
    NurseSidebar,
    LoadingSpinner,
  },
  data() {
    return {
      loading: true,
      nurse: {
        personal: {
          city: "",
          area: "",
        },
        professional: {
          bio: "",
          price: "",
          specialization: [],
          shifts: [],
          languages: [],
          availableDays: [],
        },
        documents: {
          photo: {
            url: "",
          },
        },
      },
      specializationOptions,
      shiftOptions,
      cities,
      areas,
      languageOptions,
      availableDays,
      defaultAvatar: "",
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.$router.push("/login");
        return;
      }

      const db = getFirestore();
      const docRef = doc(db, "applications", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.nurse = { ...this.nurse, ...docSnap.data() };
      }

      this.loading = false;
    });
  },
  methods: {
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Nurse_information");

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dqa1o4xga/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();

        this.nurse.documents.photo.url = data.secure_url;

        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();

        if (user) {
          // حفظ في users
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            profileImage: data.secure_url,
          });

          // حفظ في applications
          const appRef = doc(db, "applications", user.uid);
          await updateDoc(appRef, {
            "documents.photo.url": data.secure_url,
          });

          alert("Photo uploaded and saved successfully!");
        } else {
          alert("User not authenticated.");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload photo.");
      }
    },
    changePassword() {
      this.$router.push("/changepasswordnurse");
    },
    async saveProfile() {
      const auth = getAuth();
      const user = auth.currentUser;
      const { bio, price, specialization, availableDays, languages, shifts } =
        this.nurse.professional;
      const { city, area } = this.nurse.personal;

      if (!bio || bio.length < 20) {
        alert("Please provide a detailed bio (at least 20 characters).");
        return;
      }

      if (isNaN(price) || price < 50 || price > 500) {
        alert("Please enter a valid price.");
        return;
      }

      if (!city || !area) {
        alert("Please select both city and area.");
        return;
      }

      if (specialization.length === 0) {
        alert("Please select at least one specialization.");
        return;
      }

      if (availableDays.length === 0) {
        alert("Please select your available days.");
        return;
      }

      if (languages.length === 0) {
        alert("Please select at least one language.");
        return;
      }

      if (shifts.length === 0) {
        alert("Please select at least one available time.");
        return;
      }
      if (!user) {
        alert("You must be logged in to save your profile.");
        return;
      }
      const db = getFirestore();
      const docRef = doc(db, "applications", user.uid);
      await setDoc(docRef, this.nurse, { merge: true });
      alert("Profile saved successfully!");
    },
  },
};
</script>

<style scoped>
.edit-profile {
  display: flex;
}
.loading-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-container {
  padding: 40px 60px;
  flex: 1;
  max-width: 800px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.bio-group {
  margin-top: 30px;
}

.profile-picture {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-upload,
.btn-delete {
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  width: fit-content;
}

.form-label {
  font-weight: bold;
  font-size: 15px;
  display: block;
  margin-bottom: 6px;
}

.input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.input.small {
  width: 150px;
  display: inline-block;
}

.bio {
  height: 60px;
  resize: none;
  font-size: 14px;
}

.pricing-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unit {
  font-size: 13px;
  margin-left: 5px;
}

.row {
  display: flex;
  gap: 20px;
}

.col {
  flex: 1;
}

/* Base desktop styles remain */
.services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
}

/* Tablet view (2 columns, centered) */
@media (max-width: 1024px) {
  .services {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    justify-content: center;
    justify-items: center; /* centers individual labels in their grid cells */
  }
  .row {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }
  .form-container {
    padding: 30px 40px;
    max-width: 90%;
    margin: auto;
  }
}

/* Mobile view (1 column, full width) */
@media (max-width: 600px) {
  .services {
    grid-template-columns: 1fr;
    justify-items: stretch;
  }
  .row {
    flex-direction: column;
    gap: 15px;
  }
  .form-container {
    padding: 20px;
    max-width: 100%;
  }
  .input {
    width: 100%;
  }
  .pricing-field {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
.input-bio {
  width: 95%;
}

.btn-save {
  background-color: #19599a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 30px auto 0; /* auto left/right centers it */
  display: block; /* makes it respect auto margins */
}

.btn-save:hover {
  background-color: #67aef5ff;
}

.switch-group {
  display: flex;
  gap: 16px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #19599a;
}

input:checked + .slider::before {
  transform: translateX(26px);
}
.actions-container {
  margin-top: 1.5rem; /* space from previous field */
}

.changePassword {
  background-color: #19599a; /* main color */
  color: white; /* text color */
  border: none; /* remove default border */
  padding: 10px 20px; /* space inside */
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px; /* rounded edges */
  cursor: pointer; /* hand cursor */
  transition: background 0.3s ease;
}

.changePassword:hover {
  background-color: #144879; /* darker on hover */
}

.changePassword:active {
  background-color: #0f3558; /* even darker when clicked */
}
</style>
