<template>
  <div class="browse-nurses">
    <!-- Search Bar -->
    <div class="search-bar">
      <select v-model="selectedCity">
        <option value="">Choose city</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>

      <select v-model="selectedArea" :disabled="!selectedCity">
        <option value="">Choose area</option>
        <option v-for="area in filteredAreas" :key="area" :value="area">
          {{ area }}
        </option>
      </select>

      <select v-model="selectedService">
        <option value="">Search service</option>
        <option
          v-for="service in specializationOptions"
          :key="service"
          :value="service"
        >
          {{ service }}
        </option>
      </select>

      <select v-model="selectedGender">
        <option value="">Choose gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <select v-model="selectedDay">
        <option value="">Available day</option>
        <option v-for="day in availableDays" :key="day" :value="day">
          {{ day }}
        </option>
      </select>
      <select v-model="selectedShift">
        <option value="">Available time</option>
        <option value="morning">Morning</option>
        <option value="evening">Evening</option>
        <option value="overnight">overnight</option>
      </select>
      <button class="search-btn" @click="handleSearch">Search</button>
      <button class="reset-btn" @click="resetFilters">Reset</button>
    </div>

    <!-- Cards -->
    <div class="container">
      <template v-if="filteredNurses.length">
        <div v-for="nurse in filteredNurses" :key="nurse.id" class="card">
          <div class="badge">Verified</div>
          <div class="header">
            <img
              :src="nurse?.documents?.photo?.url || defaultImage"
              alt="Nurse photo"
              class="avatar"
            />

            <div>
              <h2 class="name">
                {{ nurse.personal.firstNameEn }}
                {{ nurse.personal.lastNameEn }}
              </h2>
              <div class="rating">
                ★ {{ nurse.rating ? nurse.rating.toFixed(1) : "No rating" }}
                <span class="votes">({{ nurse.ratingCount || 0 }})</span>
              </div>
            </div>
          </div>
          <div class="location">
            <span class="icon">📍</span>
            {{
              nurse.personal.city + ", " + (nurse.personal.area || "Unknown")
            }}
          </div>
          <div class="specializations">
            <span
              v-for="(spec, i) in nurse.professional.specialization"
              :key="i"
              class="spec"
            >
              {{ spec }}
            </span>
          </div>
          <p class="description">
            {{ nurse.professional.bio || "No bio available." }}
          </p>
          <div class="actions">
            <button>
              <router-link
                :to="{ name: 'NurseProfile', params: { id: nurse.id } }"
                class="view-btn"
              >
                View
              </router-link>
            </button>
          </div>
        </div>
      </template>
      <p v-else class="no-results">
        No nurses found matching the selected filters.
      </p>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { cities, areas } from "@/data/locationOptions";
import { specializationOptions } from "@/data/specializationOptions";
import { availableDays } from "@/data/availableDays";

export default {
  name: "BrowseNurse",
  data() {
    return {
      nurses: [],
      selectedCity: "",
      selectedArea: "",
      selectedService: "",
      selectedGender: "",
      selectedDay: "",
      selectedShift: "",
      cities,
      areas,
      specializationOptions,
      isFiltered: false,
      availableDays,
    };
  },
  computed: {
    acceptedNurses() {
      return this.nurses.filter(
        (nurse) => nurse.status?.toLowerCase() === "accepted"
      );
    },
    filteredNurses() {
      if (!this.isFiltered) return this.acceptedNurses;

      return this.acceptedNurses.filter((nurse) => {
        const cityMatch =
          !this.selectedCity || nurse.personal.city === this.selectedCity;

        const areaMatch =
          !this.selectedArea || nurse.personal.area === this.selectedArea;

        const serviceMatch =
          !this.selectedService ||
          nurse.professional.specialization?.includes(this.selectedService);

        const genderMatch =
          !this.selectedGender ||
          nurse.personal.gender?.toLowerCase() ===
            this.selectedGender.toLowerCase();

        const dayMatch =
          !this.selectedDay ||
          nurse.professional?.availableDays?.includes(this.selectedDay);

        const shiftMatch =
          !this.selectedShift ||
          nurse.professional?.shifts?.includes(this.selectedShift);

        return (
          cityMatch &&
          areaMatch &&
          serviceMatch &&
          genderMatch &&
          dayMatch &&
          shiftMatch
        );
      });
    },
    filteredAreas() {
      return this.selectedCity ? this.areas[this.selectedCity] || [] : [];
    },
  },
  async created() {
    const nursesSnap = await getDocs(collection(db, "applications"));
    const reviewsSnap = await getDocs(collection(db, "reviews"));

    const reviews = reviewsSnap.docs.map((doc) => doc.data());

    const nurses = nursesSnap.docs.map((doc) => {
      const nurseId = doc.id;

      // Get only reviews for this nurse
      const nurseReviews = reviews.filter(
        (review) => review.nurseId === nurseId
      );

      const ratingCount = nurseReviews.length;
      const rating = ratingCount
        ? nurseReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          ratingCount
        : null;

      return {
        id: nurseId,
        ...doc.data(),
        rating,
        ratingCount,
      };
    });

    this.nurses = nurses;
    const query = this.$route.query;
    if (query.city || query.area || query.service) {
      this.selectedCity = query.city || "";
      this.selectedArea = query.area || "";
      this.selectedService = query.service || "";
      this.isFiltered = true;
    }
  },
  methods: {
    handleSearch() {
      this.isFiltered = true;
    },
    resetFilters() {
      this.selectedCity = "";
      this.selectedArea = "";
      this.selectedService = "";
      this.selectedGender = "";
      this.selectedDay = "";
      this.selectedShift = "";
      this.isFiltered = false;
    },
  },
};
</script>

<style scoped>
.browse-nurses {
  padding-left: 120px;
  padding-right: 120px;
  padding-top: 48px;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.search-bar select,
.search-bar button {
  padding: 8px 12px;
  font-size: 14px;
}

.search-btn,
.reset-btn {
  background-color: #19599a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reset-btn {
  background-color: transparent;
  color: #19599a;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  border: 2px solid #19599a;
}

.search-btn:hover {
  background-color: #009acb;
}

.reset-btn:hover {
  background-color: #4b5563;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  padding: 12px;
}

.card {
  position: relative;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 300px;
  width: 100%;
  flex: 1 1 100%;
  max-width: 100%;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #d1fae5;
  color: #065f46;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 12px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #ccc;
  border-radius: 50%;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.rating {
  font-size: 14px;
  color: #f59e0b;
}

.votes {
  color: #888;
  margin-left: 4px;
}

.location {
  margin-top: 8px;
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 6px;
}

.specializations {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.spec {
  background: #f3f4f6;
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 999px;
  color: #333;
}

.description {
  font-size: 14px;
  color: #666;
  margin-top: 12px;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-align: left;
}

.actions {
  margin-top: 16px;
  text-align: right;
}

.view-btn {
  background-color: #19599a;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background-color: #009acb;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 18px;
  color: #777;
}
@media (min-width: 640px) {
  .card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

@media (min-width: 768px) {
  .card {
    flex: 1 1 calc(45% - 24px);
    max-width: calc(45% - 24px);
  }
}

@media (min-width: 1024px) {
  .card {
    flex: 1 1 calc(30% - 16px);
    max-width: calc(30% - 16px);
  }
}
</style>
