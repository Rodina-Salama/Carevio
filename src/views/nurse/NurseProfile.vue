<template>
  <div class="nurse-profile-container">
    <LoadingSpinner v-if="loading" class="loading-wrapper" />
    <div v-else class="nurse-profile-page">
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
                {{ nurseCity }}, {{ nurseRegion }}
              </span>
            </div>
          </div>
        </div>
        <div class="nurse-profile-right">
          <div class="price-label">
            {{ $t("nurseProfile.pricePerHour") }} :
            <span class="price-value">
              {{ nurse?.professional?.price }} EGP
            </span>
          </div>
          <button
            class="action-button"
            v-if="userStore.type !== 'nurse'"
            @click="goToBooking"
          >
            {{ $t("nurseProfile.bookNow") }}
          </button>
        </div>
      </div>

      <div
        class="availability-section"
        v-if="nurseDays.length && nurseDays[0] !== t('general.unknown')"
      >
        <h4 class="section-title">{{ $t("nurseProfile.availableDays") }}</h4>
        <p class="section-text">
          {{ nurseDays.join(", ") }}
        </p>
      </div>

      <div
        class="shift-section"
        v-if="nurseShifts.length && nurseShifts[0] !== t('general.unknown')"
      >
        <h4 class="section-title">{{ $t("nurseProfile.availableTime") }}</h4>
        <p class="section-text">
          {{ nurseShifts.join(", ") }}
        </p>
      </div>

      <div class="experience-section" v-if="nurse?.professional?.experience">
        <h4 class="section-title">{{ $t("nurseProfile.experience") }}</h4>
        <p class="section-text">
          {{ nurse?.professional?.experience }} {{ $t("nurseProfile.years") }}
        </p>
      </div>

      <div class="bio-section" v-if="nurse?.professional?.bio">
        <h4 class="section-title">{{ $t("nurseProfile.about") }}</h4>
        <p class="section-text">{{ nurse?.professional?.bio }}</p>
      </div>

      <div
        class="services-section"
        v-if="nurse?.professional?.specialization?.length"
      >
        <h4>{{ $t("nurseProfile.services") }}</h4>
        <div class="services-list">
          <span
            class="service-chip"
            v-for="(service, idx) in nurse.professional.specialization"
            :key="idx"
          >
            {{ t(`data.specializations.${service}`) }}
          </span>
        </div>
      </div>

      <div class="reviews-section" v-if="reviews.length">
        <h4 class="section-title">{{ $t("nurseProfile.reviews") }}</h4>
        <div class="review-card" v-for="(review, idx) in reviews" :key="idx">
          <div class="review-header">
            <img
              :src="review.profileImage"
              alt="User Photo"
              class="review-user-img"
            />
            <div class="review-user-info">
              <span class="review-user-name">{{
                review.fullName || "User"
              }}</span>
              <span class="review-rating">
                {{ $t("nurseProfile.rating") }}: {{ review.rating }} ★
              </span>
            </div>
          </div>
          <p class="review-text">"{{ review.comment }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useUserStore } from "@/stores/userStore";
import { useI18n } from "vue-i18n";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const loading = ref(true);

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const nurseId = route.params.id;
const nurse = ref(null);
const reviews = ref([]);

const goToBooking = () => {
  if (userStore.firebaseUser) {
    router.push({ path: "/bookingInformation", query: { nurseId } });
  } else {
    router.push("/signup");
  }
};

const fetchReviews = async () => {
  const q = query(collection(db, "reviews"), where("nurseId", "==", nurseId));
  const querySnapshot = await getDocs(q);

  const reviewsWithUsers = await Promise.all(
    querySnapshot.docs.map(async (docSnap) => {
      const reviewData = docSnap.data();
      let userData = {};

      if (reviewData.userId) {
        try {
          const userDoc = await getDoc(doc(db, "users", reviewData.userId));
          if (userDoc.exists()) {
            userData = userDoc.data();
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }

      return {
        ...reviewData,
        profileImage: userData.profileImage || require("@/assets/avatar.jpg"),
      };
    })
  );

  reviews.value = reviewsWithUsers;
};

onMounted(async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    nurse.value = docSnap.data();
    await fetchReviews();
  } else {
    console.log("No such document!");
  }
  loading.value = false;
});

const nurseCity = computed(() => {
  const city = nurse.value?.personal?.city;
  return city ? t(`data.cities.${city}`) : t("general.unknown");
});

const nurseRegion = computed(() => {
  const area = nurse.value?.personal?.area;
  return area ? t(`data.areas.${area}`) : t("general.unknown");
});

const nurseShifts = computed(() => {
  return (
    nurse.value?.professional?.shifts?.map((shift) =>
      t(`data.shifts.${shift}`)
    ) || [t("general.unknown")]
  );
});

const nurseDays = computed(() => {
  return (
    nurse.value?.professional?.availableDays?.map((day) =>
      t(`data.days.${day}`)
    ) || [t("general.unknown")]
  );
});
</script>

<style scoped>
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
  color: #19599a;
  letter-spacing: 0.2px;
}

.section-text {
  font-size: 16px;
  color: #444;
  line-height: 1.7;
  margin-bottom: 8px;
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
