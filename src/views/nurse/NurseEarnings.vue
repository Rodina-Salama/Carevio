<template>
  <div class="dashboard-container">
    <div class="content-wrapper">
      <NurseSidebar />
      <LoadingSpinner v-if="loading" class="loading-wrapper" />

      <div v-else class="main-content">
        <h1 class="title">{{ $t("earnings.title") }}</h1>

        <div class="summary-cards">
          <div class="card">
            <p>{{ $t("earnings.total") }}</p>
            <h2>EGP {{ totalEarnings }}</h2>
          </div>
          <div class="card">
            <p>{{ $t("earnings.week") }}</p>
            <h2>EGP {{ earningsThisWeek }}</h2>
          </div>
          <div class="card">
            <p>{{ $t("earnings.month") }}</p>
            <h2>EGP {{ earningsThisMonth }}</h2>
          </div>
        </div>

        <div class="transaction-table">
          <h3>{{ $t("earnings.recent") }}</h3>
          <table>
            <thead>
              <tr>
                <th>{{ $t("earnings.date") }}</th>
                <th>{{ $t("earnings.client") }}</th>
                <th>{{ $t("earnings.amount") }}</th>
                <th>{{ $t("earnings.status") }}</th>
                <th>{{ $t("earnings.paymentMethod") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactions" :key="index">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.client }}</td>
                <td>EGP {{ item.amount }}</td>
                <td>
                  <span class="paid-status">{{ $t("earnings.paid") }}</span>
                </td>
                <td>{{ item.paymentMethod }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import NurseSidebar from "@/components/NurseSidebar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { db } from "@/firebase/config";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

//  State
const loading = ref(true);
const transactions = ref([]);
const totalEarnings = ref(0);
const earningsThisWeek = ref(0);
const earningsThisMonth = ref(0);

//  Format function
function formatDate(date) {
  return dayjs(date).format("DD/MM/YYYY");
}

//  Fetch data
const fetchEarnings = async (userId) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("nurseId", "==", userId));
    const querySnapshot = await getDocs(q);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    const data = [];

    const today = dayjs();
    const startOfWeek =
      today.day() >= 6
        ? today.startOf("day").subtract(today.day() - 6, "day")
        : today.startOf("day").subtract(today.day() + 1, "day");

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      const bookingEnd = new Date(`${item.date} ${item.to || "23:59"}`);

      if (bookingEnd < now) {
        const amount = (item.price || 0) * 0.85;
        total += amount;

        const bookingDate = new Date(item.date);

        if (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        ) {
          monthTotal += amount;
        }

        if (
          dayjs(item.date).isSameOrAfter(startOfWeek, "day") &&
          dayjs(item.date).isSameOrBefore(today, "day")
        ) {
          weekTotal += amount;
        }

        data.push({
          ...item,
          date: bookingDate,
          amount,
          client: item.userName || "Client",
        });
      }
    });

    transactions.value = data.sort((a, b) => b.date - a.date);
    totalEarnings.value = total;
    earningsThisWeek.value = weekTotal;
    earningsThisMonth.value = monthTotal;
  } catch (error) {
    console.error("Error fetching earnings:", error);
  } finally {
    loading.value = false;
  }
};

//  Lifecycle
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchEarnings(user.uid);
    } else {
      loading.value = false;
    }
  });
});
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  background: #f4f6f8;
  min-height: 100vh;
  overflow-x: hidden;
}
.loading-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-wrapper {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 40px;
  background: #f4f6f8;
  width: 100%;
  overflow-x: hidden;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  flex: 1 1 calc(33.33% - 13.33px);
  min-width: 260px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card p {
  color: #555;
  margin-bottom: 8px;
}

.card h2 {
  font-size: 24px;
  color: #19599a;
}

.transaction-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.transaction-table h3 {
  font-weight: bold;
  padding: 16px;
  padding-bottom: 0;
}

/* Table setup without horizontal scroll */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* prevents overflow */
  word-wrap: break-word;
}

thead {
  background: #f0f0f0;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  word-break: break-word;
  font-size: 14px;
}

/* Badge styling */
.paid-status {
  background-color: #e1f7e9;
  color: #28a745;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 13px;
}

/* Mobile styles */
@media (max-width: 767px) {
  .main-content {
    padding: 10px;
  }

  .title {
    font-size: 22px;
  }

  .summary-cards {
    flex-direction: column;
  }

  .card {
    flex: 1 1 100%;
    min-width: 100%;
  }

  th,
  td {
    font-size: 12px;
    padding: 8px;
  }
}

/* Tablet styles */
@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    flex: 1 1 calc(50% - 10px);
  }

  .main-content {
    padding: 30px;
  }
}
</style>
