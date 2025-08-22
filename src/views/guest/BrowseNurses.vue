<template>
  <div class="browse-nurses">
    <!-- Search Bar -->
    <div class="search-bar">
      <select v-model="selectedCity">
        <option value="">{{ $t("browse.chooseCity") }}</option>
        <option v-for="city in cities" :key="city" :value="city">
          {{ $t(`data.cities.${city}`) }}
        </option>
      </select>

      <select v-model="selectedArea" :disabled="!selectedCity">
        <option value="">{{ $t("browse.chooseArea") }}</option>
        <option v-for="area in filteredAreas" :key="area" :value="area">
          {{ $t(`data.areas.${area}`) }}
        </option>
      </select>

      <select v-model="selectedService">
        <option value="">{{ $t("browse.searchService") }}</option>
        <option
          v-for="service in specializationOptions"
          :key="service"
          :value="service"
        >
          {{ $t(`data.specializations.${service}`) }}
        </option>
      </select>

      <select v-model="selectedGender">
        <option value="">{{ $t("browse.chooseGender") }}</option>
        <option value="female">{{ $t("browse.female") }}</option>
        <option value="male">{{ $t("browse.male") }}</option>
      </select>
      <select v-model="selectedDay">
        <option value="">{{ $t("browse.chooseDay") }}</option>
        <option v-for="day in availableDays" :key="day" :value="day">
          {{ $t(`data.days.${day}`) }}
        </option>
      </select>
      <select v-model="selectedShift">
        <option value="">{{ $t("browse.chooseShift") }}</option>
        <option value="morning">{{ $t("data.shifts.morning") }}</option>
        <option value="evening">{{ $t("data.shifts.evening") }}</option>
        <option value="overnight">{{ $t("data.shifts.overnight") }}</option>
      </select>

      <button class="search-btn" @click="handleSearch">
        {{ $t("browse.searchButton") }}
      </button>
      <button class="reset-btn" @click="resetFilters">
        {{ $t("browse.resetButton") }}
      </button>
    </div>

    <!-- Cards -->
    <div class="container">
      <div v-if="loading" class="loading-wrapper">
        <LoadingSpinner />
      </div>
      <template v-else-if="filteredNurses.length">
        <div v-for="nurse in filteredNurses" :key="nurse.id" class="card">
          <div class="badge">{{ $t("browse.verifiedBadge") }}</div>
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
                ★
                {{
                  nurse.rating ? nurse.rating.toFixed(1) : $t("browse.noRating")
                }}

                <span class="votes">({{ nurse.ratingCount || 0 }})</span>
              </div>
            </div>
          </div>
          <div class="location">
            <span class="contact-icon"
              ><i class="fas fa-location-dot"></i>&nbsp;</span
            >
            {{
              $t(`data.cities.${nurse.personal.city}`) +
              ", " +
              $t(`data.areas.${nurse.personal.area}`)
            }}
          </div>
          <div class="specializations">
            <span
              v-for="(spec, i) in nurse.professional.specialization"
              :key="i"
              class="spec"
            >
              {{ $t(`data.specializations.${spec}`) }}
            </span>
          </div>
          <p class="description">
            {{ nurse.professional.bio || "No bio available." }}
          </p>
          <div class="actions">
            <router-link
              :to="{ name: 'NurseProfile', params: { id: nurse.id } }"
              class="view-btn"
            >
              {{ $t("browse.viewButton") }}
            </router-link>
          </div>
        </div>
      </template>
      <p v-else class="no-results">
        {{ $t("browse.noNursesFound") }}
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
import LoadingSpinner from "@/components/LoadingSpinner.vue";

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
      loading: true,
    };
  },
  computed: {
    acceptedNurses() {
      return this.nurses.filter(
        (nurse) =>
          nurse.status?.toLowerCase() === "accepted" &&
          nurse.isVisible === true &&
          nurse.isBanned !== true
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
    this.loading = true;
    try {
      const nursesSnap = await getDocs(collection(db, "applications"));
      const reviewsSnap = await getDocs(collection(db, "reviews"));

      const reviews = reviewsSnap.docs.map((doc) => doc.data());

      const nurses = nursesSnap.docs.map((doc) => {
        const nurseId = doc.id;

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
    } finally {
      this.loading = false;
    }
  },
  components: {
    LoadingSpinner,
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
.loading-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.browse-nurses {
  padding: 1rem;
  max-width: 1800px;
  margin: 0 auto;
}
.search-bar {
  display: grid;
  gap: 0.75rem;
  width: 100%;
  padding: 10px 14px;
}

.search-bar {
  grid-template-columns: repeat(2, 1fr);
}

/* Smaller selects & buttons on mobile only */
@media (max-width: 767px) {
  .search-bar select {
    margin: 5px;
  }
  .search-bar {
    justify-self: center;
  }
}
/* Tablet - 3 columns */
@media (min-width: 768px) {
  .search-bar {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop - 6 columns */
@media (min-width: 1024px) {
  .search-bar {
    grid-template-columns: repeat(8, 1fr);
    max-width: 1200px;
  }
}

/* Button group adjustments */
.button-group {
  grid-column: span 2; /* Makes buttons span 2 columns on mobile */
}

@media (min-width: 768px) {
  .button-group {
    grid-column: span 3; /* Span 3 columns on tablet */
  }
}

@media (min-width: 1024px) {
  .button-group {
    grid-column: auto; /* Normal flow on desktop */
  }
}
@media (max-width: 768px) {
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .search-bar {
    width: 100%;
    max-width: 300px;
  }
}

.search-bar select {
  padding: 5px 8px;
  font-size: 14px;
}
.search-bar button {
  padding: 4px 7px;
  font-size: 14px;
}

.search-btn {
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
  transition: background-color 0.3s;
}
.search-btn:hover {
  background-color: #67aef5ff;
}

.reset-btn:hover {
  background-color: #67aef5ff;
  color: white;
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
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Responsive height control */
.card {
  min-height: 280px;
  height: auto;
}

/* Tablet and above */
@media (min-width: 768px) {
  .card {
    min-height: 320px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    min-height: 300px; /* Fixed height for desktop */
  }
}

/* Card hover effect */
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* Responsive width control */
@media (min-width: 640px) {
  .card {
    flex: 1 1 calc(50% - 1rem); /* 2 cards per row */
    max-width: calc(50% - 1rem);
  }
}

@media (min-width: 768px) {
  .card {
    flex: 1 1 calc(33.333% - 1rem); /* 3 cards per row */
    max-width: calc(33.333% - 1rem);
  }
}

@media (min-width: 1024px) {
  .card {
    flex: 1 1 calc(25% - 1rem); /* 4 cards per row */
    max-width: calc(25% - 1rem);
  }
}

.badge {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
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
  /* Base Styling */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #19599a;
  color: white;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
