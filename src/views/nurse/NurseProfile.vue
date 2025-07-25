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
              {{ nurse?.personal?.lastNameEn }}
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
            Price per hour :
            <span class="price-value"
              >{{ nurse?.professional?.price }} EGP</span
            >
          </div>
          <button
            class="action-button"
            v-if="userStore.type !== 'nurse'"
            @click="goToBooking"
          >
            BOOK NOW
          </button>
        </div>
      </div>
      <div
        class="availability-section"
        v-if="nurse?.professional?.availableDays?.length"
      >
        <h4 class="section-title">Available Days</h4>
        <p class="section-text">
          {{ nurse.professional.availableDays.join(", ") }}
        </p>
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
      <div class="reviews-section" v-if="reviews.length">
        <h4 class="section-title">Reviews</h4>
        <div class="review-card" v-for="(review, idx) in reviews" :key="idx">
          <div class="review-header">
            <div class="review-user-info">
              <span class="review-user-name">{{
                review.fullName || "User"
              }}</span>
              <span class="review-rating">Rating: {{ review.rating }} ★</span>
            </div>
          </div>
          <p class="review-text">"{{ review.comment }}"</p>
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
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { collection, query, where, getDocs } from "firebase/firestore";
const reviews = ref([]);
const route = useRoute();
const nurseId = route.params.id;
const nurse = ref(null);
const router = useRouter();
const userStore = useUserStore();

function goToBooking() {
  if (userStore.firebaseUser) {
    router.push({ path: "/bookingInformation", query: { nurseId } });
  } else {
    router.push("/signup");
  }
}
onMounted(async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    nurse.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
});
const fetchReviews = async () => {
  const q = query(collection(db, "reviews"), where("nurseId", "==", nurseId));
  const querySnapshot = await getDocs(q);
  reviews.value = querySnapshot.docs.map((doc) => doc.data());
};

onMounted(async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    nurse.value = docSnap.data();
    await fetchReviews(); // Fetch reviews after nurse is loaded
  } else {
    console.log("No such document!");
  }
});
</script>

<style scoped>
body {
  text-align: left;
}
.nurse-profile-container {
  display: flex;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 32px 0 48px 0;
}

.nurse-profile-page {
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.07);
  padding: 40px 36px 32px 36px;
}

.nurse-profile-header {
  display: flex;
  justify-content: space-between;
  align-items: left;
  gap: 40px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}

.nurse-profile-left {
  display: flex;
  align-items: left;
  gap: 28px;
  flex: 1;
}

.nurse-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 14px;
  background: #f2f2f2;
  border: 1.5px solid #e5e7eb;
}

.nurse-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.nurse-name {
  font-size: 26px;
  margin: 0 0 2px 0;
  font-weight: 700;
  color: #19599a;
  letter-spacing: 0.5px;
}

.nurse-subinfo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nurse-location {
  color: #6b7280;
  font-size: 16px;
}

.nurse-profile-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
  flex: 1;
  min-width: 220px;
}

.price-label {
  font-size: 19px;
  color: #222;
}

.price-value {
  font-weight: 700;
  font-size: 21px;
  color: #1d4ed8;
  margin-left: 4px;
}

.action-button {
  background-color: #19599a;
  color: white;
  cursor: pointer;
  padding: 12px 32px;
  border: none;
  border-radius: 9px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
  margin-top: 4px;
  letter-spacing: 0.5px;
}
.action-button:hover {
  background-color: #009acb;
}

.availability-section,
.shift-section,
.experience-section,
.bio-section,
.services-section,
.reviews-section {
  margin-bottom: 22px;
}

.section-title,
.services-section h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 7px;
  text-align: left;
  color: #19599a;
  letter-spacing: 0.2px;
}

.section-text {
  font-size: 16px;
  color: #444;
  line-height: 1.7;
  margin-bottom: 8px;
  text-align: left;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.service-chip {
  background: #f3f4f6;
  color: #374151;
  border-radius: 16px;
  padding: 7px 18px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
  font-weight: 500;
}

.reviews-section {
  margin-top: 30px;
}

.review-card {
  background-color: #f8fafc;
  border-radius: 14px;
  padding: 18px 20px 14px 20px;
  margin-bottom: 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(25, 89, 154, 0.04);
  text-align: left;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}

.review-user-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #d1d5db;
  background: #e5e7eb;
}

.review-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-user-name {
  font-weight: 600;
  color: #19599a;
  font-size: 16px;
}

.review-rating {
  font-size: 15px;
  color: #f59e42;
  font-weight: 500;
}

.review-text {
  font-size: 15.5px;
  color: #333;
  margin-bottom: 0;
  margin-left: 4px;
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .nurse-profile-page {
    padding: 24px 8px 24px 8px;
  }
  .nurse-profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .nurse-profile-right {
    align-items: flex-start;
    min-width: 0;
  }
  .nurse-image {
    width: 100px;
    height: 100px;
  }
  .nurse-name {
    font-size: 20px;
  }
  .price-label {
    font-size: 16px;
  }
  .price-value {
    font-size: 18px;
  }
  .action-button {
    width: 100%;
    text-align: center;
  }
  .review-card {
    padding: 16px 18px;
  }
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .review-user-img {
    width: 40px;
    height: 40px;
  }
  .review-user-name {
    font-size: 15px;
  }
  .review-rating {
    font-size: 14px;
  }
  .review-text {
    font-size: 14px;
  }
}
</style>
