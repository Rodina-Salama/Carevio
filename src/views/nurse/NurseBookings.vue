<template>
  <div class="dashboard-container">
    <NurseSidebar />
    <LoadingSpinner v-if="loading" class="loading-wrapper" />

    <div v-else class="main-content">
      <h1 class="title">{{ $t("nurseBookings.title") }}</h1>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          {{ $t("nurseBookings.active") }}
        </button>
        <button
          :class="{ active: activeTab === 'past' }"
          @click="activeTab = 'past'"
        >
          {{ $t("nurseBookings.past") }}
        </button>
      </div>

      <!-- Time Filters -->
      <div class="time-filters">
        <select v-model="timeFilter">
          <option value="all">{{ $t("nurseBookings.all") }}</option>
          <option value="today">{{ $t("nurseBookings.today") }}</option>
          <option value="tomorrow">{{ $t("nurseBookings.tomorrow") }}</option>
          <option value="thisWeek">{{ $t("nurseBookings.thisWeek") }}</option>
        </select>
      </div>

      <div v-if="filteredBookings.length === 0" class="no-bookings">
        {{ $t("nurseBookings.noBookings") }}
      </div>

      <div v-else class="bookings-table-container">
        <table class="bookings-table">
          <thead>
            <tr>
              <th>{{ $t("nurseBookings.patientName") }}</th>
              <th>{{ $t("nurseBookings.date") }}</th>
              <th>{{ $t("nurseBookings.time") }}</th>
              <th>{{ $t("nurseBookings.address") }}</th>
              <th>{{ $t("nurseBookings.details") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in filteredBookings" :key="booking.id">
              <td>{{ booking.userName }}</td>
              <td>{{ booking.date }}</td>
              <td>{{ booking.from }} - {{ booking.to }}</td>
              <td>{{ booking.address }}</td>
              <td>
                <router-link
                  :to="`/nursebookings/${booking.id}`"
                  class="view-btn"
                >
                  {{ $t("nurseBookings.view") }}
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";
import { ref, computed, onMounted } from "vue";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ar";
import "dayjs/locale/en";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { onAuthStateChanged } from "firebase/auth";

dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.updateLocale("en", {
  weekStart: 6, // السبت
});
dayjs.updateLocale("ar", {
  weekStart: 6,
});
export default {
  components: {
    NurseSidebar,
    LoadingSpinner,
  },
  setup() {
    const bookings = ref([]);
    const loading = ref(true);
    const activeTab = ref("active");
    const timeFilter = ref("all");

    onMounted(() => {
      const auth = getAuth();

      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.error("No logged-in nurse");
          loading.value = false;
          return;
        }

        try {
          const db = getFirestore();
          const q = query(
            collection(db, "bookings"),
            where("nurseId", "==", user.uid)
          );

          const querySnapshot = await getDocs(q);
          bookings.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          loading.value = false;
        }
      });
    });

    const filteredBookings = computed(() => {
      const now = dayjs();

      let filtered = bookings.value
        .filter((b) => !b.cancelled)
        .filter((b) => {
          let endTime = dayjs(`${b.date} ${b.to}`, "YYYY-MM-DD hh:mm A");
          const startTime = dayjs(`${b.date} ${b.from}`, "YYYY-MM-DD hh:mm A");

          if (endTime.isBefore(startTime)) {
            endTime = endTime.add(1, "day");
          }
          return activeTab.value === "active"
            ? endTime.isAfter(now)
            : endTime.isBefore(now);
        });

      if (timeFilter.value === "today") {
        filtered = filtered.filter((b) => dayjs(b.date).isSame(now, "day"));
      } else if (timeFilter.value === "tomorrow") {
        const tomorrow = now.add(1, "day");
        filtered = filtered.filter((b) =>
          dayjs(b.date).isSame(tomorrow, "day")
        );
      } else if (timeFilter.value === "thisWeek") {
        const startOfWeek = now.startOf("week");
        const endOfWeek = now.endOf("week");
        filtered = filtered.filter((b) => {
          const bookingDate = dayjs(b.date);
          return (
            bookingDate.isSameOrAfter(startOfWeek, "day") &&
            bookingDate.isSameOrBefore(endOfWeek, "day")
          );
        });
      }

      return filtered;
    });

    return {
      bookings,
      loading,
      activeTab,
      timeFilter,
      filteredBookings,
    };
  },
};
</script>
<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #f9f9f9;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #111;
}

.no-bookings {
  text-align: center;
  color: #777;
  font-size: 18px;
}

.bookings-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-card {
  background: #f2f2f2;
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
}

.booking-card:hover .view-btn {
  background-color: #fff;
  color: #67aef5ff;
  border: 1px solid #19599a;
}

.card-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.client-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
}

.client-name {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

.address,
.service {
  font-size: 14px;
  color: #555;
  margin: 0;
}

.view-btn {
  background-color: #19599a;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s ease;
}
.view-btn:hover {
  background-color: #67aef5ff;
  color: #fff;
}
.bookings-table-container {
  margin-top: 20px;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table th,
.bookings-table td {
  padding: 12px 16px;
  border: 1px solid #ddd;
  text-align: left;
}

.bookings-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.filter-tabs button {
  padding: 6px 14px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 6px;
}

.filter-tabs button.active {
  background: #19599a;
  color: #fff;
  border-color: #19599a;
}

.time-filters {
  margin-bottom: 20px;
}
.loading-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ Responsive Table Without Horizontal Scroll */
@media (max-width: 768px) {
  .bookings-table thead {
    display: none;
  }

  .bookings-table,
  .bookings-table tbody,
  .bookings-table tr,
  .bookings-table td {
    display: block;
    width: 100%;
  }

  .bookings-table tr {
    margin-bottom: 16px;
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  .bookings-table td {
    border: none;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    font-size: 14px;
  }
}
</style>
