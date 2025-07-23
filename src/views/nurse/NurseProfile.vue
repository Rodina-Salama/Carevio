<template>
  <div class="nurse-profile-container">
    <div class="nurse-profile-page">
      <div class="nurse-profile-header">
        <div class="nurse-profile-left">
          <img
            class="nurse-image"
            :src="nurse?.documents?.photo?.url"
            alt="Nurse Photo"
          />
          <div class="nurse-info">
            <h2 class="nurse-name">
              {{ nurse?.personal?.firstNameEn }}
            </h2>
            <div class="nurse-subinfo">
              <span class="nurse-location">
                {{ nurse?.personal?.city }}, {{ nurse?.personal?.area }}
              </span>
            </div>
          </div>
        </div>
        <div class="nurse-profile-right">
          <div class="price-label">
            Price per visit :
            <span class="price-value"
              >{{ nurse?.professional?.price }} EGP</span
            >
          </div>
          <button class="action-button">BOOK NOW</button>
        </div>
      </div>
      <div class="shift-section" v-if="nurse?.professional?.shifts?.length">
        <h4 class="section-title">Available time</h4>
        <p class="section-text">
          {{ nurse.professional.shifts.join(", ") }}
        </p>
        <p class="section-text">{{ nurse.professional.shift }}</p>
      </div>
      <div class="experience-section" v-if="nurse?.professional?.experience">
        <h4 class="section-title">Experience</h4>
        <p class="section-text">{{ nurse?.professional?.experience }} years</p>
      </div>
      <div class="bio-section" v-if="nurse?.professional?.bio">
        <h4 class="section-title">About</h4>
        <p class="section-text">{{ nurse?.professional?.bio }}</p>
      </div>

      <div
        class="services-section"
        v-if="nurse?.professional?.specialization?.length"
      >
        <h4>Services</h4>
        <div class="services-list">
          <span
            class="service-chip"
            v-for="(service, idx) in nurse.professional.specialization"
            :key="idx"
          >
            {{ service }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const route = useRoute();
const nurseId = route.params.id;
const nurse = ref(null);

onMounted(async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    nurse.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
});
</script>

<style scoped>
.nurse-profile-container {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  background-color: #f9f9f9;
}

.nurse-profile-page {
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 32px 48px;
}

.nurse-profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
}

.nurse-profile-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nurse-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  background: #f2f2f2;
  border: 1px solid #e5e7eb;
}

.nurse-info h2 {
  font-size: 24px;
  margin: 0 0 6px 0;
  font-weight: 600;
  align-text: left;
}

.nurse-title {
  color: #2563eb;
  font-size: 16px;
  margin-bottom: 4px;
}

.nurse-location {
  color: #6b7280;
  font-size: 15px;
}

.nurse-profile-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.price-label {
  font-size: 18px;
  color: #222;
  margin-bottom: 8px;
}

.price-value {
  font-weight: 600;
  font-size: 20px;
  color: #1d4ed8;
  margin-left: 4px;
}

.action-button {
  background-color: #19599a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}
.action-button:hover {
  background-color: #009acb;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: left;
}

.section-text {
  line-height: 1.6;
  color: #444;
  font-size: 16px;
  text-align: left;
  margin-bottom: 16px;
}

.experience-section,
.bio-section,
.services-section,
.shift-section {
  margin-bottom: 24px;
}

.services-section h4 {
  font-size: 17px;
  margin-bottom: 8px;
  font-weight: 700;
  text-align: left;
}

.services-title {
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 8px;
  display: block;
  color: #111;
}

.services-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.service-chip {
  background: #f3f4f6;
  color: #374151;
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
}
</style>
