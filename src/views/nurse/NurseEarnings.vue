<template>
  <div class="dashboard-container">
    <NurseNavbar />
    <div class="content-wrapper">
      <nurse-sidebar />

      <div class="main-content">
        <h1 class="title">Earnings</h1>

        <div class="summary-cards">
          <div class="card">
            <p>Total Earnings</p>
            <h2>EGP {{ totalEarnings }}</h2>
          </div>
          <div class="card">
            <p>Earnings This Week</p>
            <h2>EGP {{ earningsThisWeek }}</h2>
          </div>
          <div class="card">
            <p>Earnings This Month</p>
            <h2>EGP {{ earningsThisMonth }}</h2>
          </div>
        </div>

        <div class="transaction-table">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Booking Date</th>
                <th>Client Name</th>
                <th>Your Earnings</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactions" :key="index">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.client }}</td>
                <td>EGP {{ item.amount }}</td>
                <td><span class="paid-status">Paid</span></td>
                <td>{{ item.paymentMethod }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/config";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import NurseSidebar from "@/components/NurseSidebar.vue";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default {
  components: {
    NurseSidebar,
  },
  data() {
    return {
      transactions: [],
      totalEarnings: 0,
      earningsThisWeek: 0,
      earningsThisMonth: 0,
    };
  },
  methods: {
    async fetchEarnings() {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const nurseId = user.uid;
        const today = dayjs(); // current date
        const startOfWeek =
          today.day() >= 6
            ? today.startOf("day").subtract(today.day() - 6, "day")
            : today.startOf("day").subtract(today.day() + 1, "day");
        const startOfMonth = today.startOf("month");

        let total = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        const data = [];

        querySnapshot.forEach((doc) => {
          const item = doc.data();

          // Ensure the booking is for this nurse
          if (item.nurseId !== nurseId) return;

          // Parse the date string into a dayjs object
          const bookingDate = item.date ? dayjs(item.date) : null;
          if (!bookingDate || !bookingDate.isValid()) return;

          // Mark as completed if past or has status 'completed'
          const endTime = item.to || "11:59 PM"; // fallback if missing
          const fullEndDateTime = dayjs(
            `${item.date} ${endTime}`,
            "YYYY-MM-DD hh:mm A"
          );
          const isCompleted = fullEndDateTime.isBefore(dayjs());
          if (!isCompleted) return;

          const amount = (item.price || 0) * 0.85;

          total += amount;
          if (
            bookingDate.isSameOrAfter(startOfWeek, "day") &&
            bookingDate.isSameOrBefore(today, "day")
          ) {
            weekTotal += amount;
          }
          if (
            bookingDate.isSameOrAfter(startOfMonth, "day") &&
            bookingDate.isSameOrBefore(today, "day")
          ) {
            monthTotal += amount;
          }

          data.push({
            ...item,
            date: bookingDate.toDate(), // convert to JS Date for sorting/display
            amount,
            client: item.userName || "Client",
          });
        });

        this.transactions = data.sort((a, b) => b.date - a.date);
        this.totalEarnings = total;
        this.earningsThisWeek = weekTotal;
        this.earningsThisMonth = monthTotal;
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    },

    formatDate(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
  },
  mounted() {
    this.fetchEarnings();
  },
};
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
  margin-bottom: 20px;
  font-weight: bold;
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
