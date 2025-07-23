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
                <th>Amount Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactions" :key="index">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.client }}</td>
                <td>EGP {{ item.amount }}</td>
                <td><span class="paid-status">Paid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import NurseSidebar from "@/components/NurseSidebar.vue";
export default {
  name: "NurseEarnings",
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
      const querySnapshot = await getDocs(collection(db, "earning"));
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      let total = 0;
      let weekTotal = 0;
      let monthTotal = 0;

      const data = [];

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const dateObj = item.date.toDate();

        total += item.amount;
        if (dateObj >= startOfWeek) weekTotal += item.amount;
        if (dateObj >= startOfMonth) monthTotal += item.amount;

        data.push({
          ...item,
          date: dateObj,
        });
      });

      this.transactions = data.sort((a, b) => b.date - a.date);
      this.totalEarnings = total;
      this.earningsThisWeek = weekTotal;
      this.earningsThisMonth = monthTotal;
    },
    formatDate(date) {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },
  },
  mounted() {
    this.fetchEarnings();

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
  },
  beforeUnmount() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  background: #f4f6f8;
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 40px;
  background: #f4f6f8;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
}

.summary-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.card p {
  color: #555;
  margin-bottom: 8px;
}

.card h2 {
  font-size: 24px;
  color: #007bff;
}

.transaction-table {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.transaction-table h3 {
  margin-bottom: 20px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f0f0f0;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.paid-status {
  background-color: #e1f7e9;
  color: #28a745;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
}
</style>
