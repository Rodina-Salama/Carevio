<template>
  <div class="edit-profile">
    <NurseSidebar />
    <LoadingSpinner v-if="loading" class="loading-wrapper" />

    <div v-else class="form-container">
      <h2 class="title">Edit Profile</h2>

      <!-- Profile Picture -->
      <div class="form-group">
        <label class="form-label">Profile picture</label>
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
        <label class="form-label">Bio</label>
        <textarea
          v-model="nurse.professional.bio"
          placeholder="Enter here"
          class="input bio"
        ></textarea>
      </div>

      <!-- Pricing -->
      <div class="form-group">
        <label class="form-label"
          >Pricing (Carevio takes a 15% commission)</label
        >
        <div class="pricing-field">
          <input
            v-model.number="nurse.professional.price"
            type="number"
            class="input small"
            placeholder="100"
          />
          <span class="unit">EGP /hour</span>
        </div>
      </div>

      <!-- Government & Area -->
      <div class="form-group row">
        <div class="col">
          <label class="form-label">Government</label>
          <select v-model="nurse.personal.city" class="input">
            <option disabled value="">Select City</option>
            <option v-for="city in cities" :key="city">{{ city }}</option>
          </select>
        </div>
        <div class="col">
          <label class="form-label">Area</label>
          <select v-model="nurse.personal.area" class="input">
            <option disabled value="">Select Area</option>
            <option
              v-for="area in areas[nurse.personal.city] || []"
              :key="area"
            >
              {{ area }}
            </option>
          </select>
        </div>
      </div>

      <!-- Services -->
      <div class="form-group">
        <label class="form-label">Services</label>
        <div class="services">
          <label v-for="service in specializationOptions" :key="service">
            <input
              type="checkbox"
              :value="service"
              v-model="nurse.professional.specialization"
            />
            {{ service }}
          </label>
        </div>
      </div>

      <!-- Available Days -->
      <div class="form-group">
        <label class="form-label">Available Days</label>
        <div class="services">
          <label v-for="day in availableDays" :key="day">
            <input
              type="checkbox"
              :value="day"
              v-model="nurse.professional.availableDays"
            />
            {{ day }}
          </label>
        </div>
      </div>

      <!-- Languages -->
      <div class="form-group">
        <label class="form-label">Languages</label>
        <div class="services">
          <label v-for="lang in languageOptions" :key="lang">
            <input
              type="checkbox"
              :value="lang"
              v-model="nurse.professional.languages"
            />
            {{ lang }}
          </label>
        </div>
      </div>

      <!-- Available shifts -->
      <div class="form-group">
        <label class="form-label">Available Time</label>
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
              {{ shift.charAt(0).toUpperCase() + shift.slice(1) }}
              ({{ times[0].from }} - {{ times[times.length - 1].to }})
            </label>
          </div>
        </div>
      </div>
      <!-- Profile Visibility -->
      <div class="form-group switch-group">
        <label class="form-label">Show my profile on the site</label>
        <label class="switch">
          <input type="checkbox" v-model="nurse.isVisible" />
          <span class="slider"></span>
        </label>
      </div>
      <div class="actions-container">
        <button @click="changePassword" class="changePassword">
          Change Password
        </button>
      </div>
      <!-- Save Button -->
      <button class="btn-save" @click="saveProfile">Save</button>
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
  text-align: left;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
  text-align: left;
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

.services {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
}

.btn-save {
  background-color: #19599a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 30px;
}
.btn-save:hover {
  background-color: #67aef5ff;
}
.switch-group {
  display: flex;
  align-items: left;
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
</style>
