<template>
  <div class="edit-profile">
    <NurseSidebar />
    <div class="form-container">
      <h2 class="title">Edit Profile</h2>

      <!-- Profile Picture -->
      <div class="form-group">
        <label class="form-label">Profile picture</label>
        <div class="profile-picture">
          <img :src="nurse.photoURL || defaultAvatar" class="avatar" />
          <div class="btns">
            <input type="file" @change="uploadPhoto" />
            <button class="btn-upload">Upload photo</button>
            <button class="btn-delete" @click="deletePhoto">Delete</button>
          </div>
        </div>
      </div>
      <!-- Bio -->
      <div class="form-group bio-group">
        <label class="form-label">Bio</label>
        <textarea
          v-model="nurse.bio"
          placeholder="Enter here"
          class="input bio"
        ></textarea>
      </div>

      <!-- Pricing -->
      <div class="form-group">
        <label class="form-label">Pricing</label>
        <div class="pricing-field">
          <input
            v-model.number="nurse.pricing"
            type="number"
            class="input small"
            placeholder="10"
          />
          <span class="unit">EGP /hour</span>
        </div>
      </div>

      <!-- Government & Area -->
      <div class="form-group row">
        <div class="col">
          <label class="form-label">Government</label>
          <select v-model="nurse.government" class="input">
            <option disabled value="">Enter here</option>
            <option>Cairo</option>
            <option>Giza</option>
            <option>Alexandria</option>
          </select>
        </div>
        <div class="col">
          <label class="form-label">Area</label>
          <select v-model="nurse.area" class="input">
            <option disabled value="">Enter here</option>
            <option>Nasr City</option>
            <option>Dokki</option>
            <option>Maadi</option>
          </select>
        </div>
      </div>

      <!-- Services -->
      <div class="form-group">
        <label class="form-label">Services</label>
        <div class="services">
          <label v-for="service in allServices" :key="service">
            <input type="checkbox" :value="service" v-model="nurse.services" />
            {{ service }}
          </label>
        </div>
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

export default {
  components: {
    NurseSidebar,
  },
  data() {
    return {
      nurse: {
        photoURL: "",
        bio: "",
        pricing: "",
        government: "",
        area: "",
        services: [],
      },
      allServices: [
        "Elderly Care",
        "Post-Operative Care",
        "Injections & IV Therapy",
        "Pediatric Support",
        "Bedridden Patient",
        "Vital Signs Monitoring",
      ],
      defaultAvatar: "",
    };
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const db = getFirestore();
    const docRef = doc(db, "nurses", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.nurse = { ...this.nurse, ...docSnap.data() };
    }
  },
  methods: {
    uploadPhoto() {},
    deletePhoto() {
      this.nurse.photoURL = "";
    },
    async saveProfile() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save your profile.");
        return;
      }
      const db = getFirestore();
      const docRef = doc(db, "nurses", user.uid);
      await setDoc(docRef, this.nurse);
      alert("Profile saved!");
    },
  },
};
</script>

<style scoped>
.edit-profile {
  display: flex;
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
  background-color: #2d8cf0;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 30px;
}
</style>
