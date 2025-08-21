<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Material+Icons"
    rel="stylesheet"
  />
  <div class="dashboard-container">
    <NurseSidebar />
    <LoadingSpinner v-if="loading" class="loading-wrapper" />

    <div v-else class="main-content">
      <h1 class="title">{{ $t("earnings.title") }}</h1>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="card">
          <p>{{ $t("earnings.total") }}</p>
          <h2>EGP {{ formatMoney(totalEarnings) }}</h2>
        </div>
        <!-- Nurse owed -->
        <div class="card">
          <p>{{ $t("earnings.nurseOwed") }}</p>
          <h2 class="positive">EGP {{ formatMoney(nurseOwed) }}</h2>
        </div>

        <!-- Site owed -->
        <div class="card">
          <p>{{ $t("earnings.siteOwed") }}</p>
          <h2 class="negative">EGP {{ formatMoney(siteOwed) }}</h2>
          <button @click="payCash" class="cash-pay-btn" v-if="siteOwed">
            Pay Site
          </button>
        </div>
        <!-- Nurse Points -->
        <div class="card points-card">
          <p>
            {{ $t("earnings.points") }}
            <span class="material-symbols-outlined" @click="toggleTooltip"
              >Info</span
            >
          </p>
          <span v-if="showTooltip" class="tooltip">
            {{ $t("earnings.tooltip") }}
          </span>
          <h2>{{ nursePoints }}</h2>
        </div>
        <!-- Rewards Card -->
        <div class="card rewards-card">
          <p>
            {{ $t("earnings.rewards") }}
            <span
              class="material-symbols-outlined"
              @click="showRewardsTooltip = !showRewardsTooltip"
            >
              Info
            </span>
          </p>
          <span v-if="showRewardsTooltip" class="tooltip">
            {{ $t("earnings.rewardsTooltip") }}
          </span>
          <h2>EGP {{ formatMoney(rewardsEarned) }}</h2>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="payment-method-section">
        <h3>{{ $t("earnings.setPaymentMethod") }}</h3>
        <select v-model="selectedMethod" :disabled="!isEditing">
          <option disabled value="">{{ $t("earnings.selectMethod") }}</option>
          <option value="paypal">{{ $t("earnings.paypal") }}</option>
        </select>
        <input
          v-if="selectedMethod"
          type="text"
          v-model="paymentDetails"
          :class="selectedMethod"
          :placeholder="getPlaceholder(selectedMethod)"
          :disabled="!isEditing"
        />
        <button v-if="isEditing" @click="savePaymentMethod">
          {{ $t("earnings.save") }}
        </button>
        <button v-else-if="selectedMethod" @click="isEditing = true">
          {{ $t("earnings.edit") }}
        </button>
        <button v-else @click="isEditing = true">
          {{ $t("earnings.addMethod") }}
        </button>
      </div>

      <!-- Transactions Table -->
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
              <td>EGP {{ formatMoney(item.amount) }}</td>
              <td>
                <span class="paid-status" :class="{ pending: item.pending }">
                  {{ item.pending ? "Pending" : "Paid" }}
                </span>
              </td>
              <td>{{ item.paymentMethod }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import NurseSidebar from "@/components/NurseSidebar.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { db } from "@/firebase/config";

const loading = ref(true);
const transactions = ref([]);
const totalEarnings = ref(0);
const earningsThisWeek = ref(0);
const nurseOwed = ref(0);
const siteOwed = ref(0);

const selectedMethod = ref("");
const paymentDetails = ref("");
const isEditing = ref(false);

const nursePoints = ref(0);
const rewardsEarned = ref([]);
const showTooltip = ref(false);
const showRewardsTooltip = ref(false);

function toggleTooltip() {
  showTooltip.value = !showTooltip.value;
}
function formatMoney(n) {
  return (Number(n) || 0).toFixed(2);
}
function formatDate(d) {
  return dayjs(d).format("DD/MM/YYYY");
}
function getPlaceholder(method) {
  if (method === "paypal") return "Enter your PayPal email";
  return "";
}

async function savePaymentMethod() {
  const user = getAuth().currentUser;
  if (!user) return;
  try {
    await setDoc(
      doc(db, "applications", user.uid),
      {
        paymentMethod: selectedMethod.value,
        paymentDetails: paymentDetails.value.trim(),
      },
      { merge: true }
    );
    isEditing.value = false;
  } catch (e) {
    console.error(e);
  }
}

async function loadPaymentMethod(userId) {
  const docSnap = await getDoc(doc(db, "applications", userId));
  if (docSnap.exists()) {
    selectedMethod.value = docSnap.data().paymentMethod || "";
    paymentDetails.value = docSnap.data().paymentDetails || "";
  }
}

async function fetchEarnings(userId) {
  loading.value = true;
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("nurseId", "==", userId));
    const snapshot = await getDocs(q);

    let total = 0;
    let weekTotal = 0;
    let sitePending = 0;
    let nursePending = 0;
    const items = [];

    const today = dayjs();
    const startOfWeek = today.startOf("week");

    snapshot.forEach((docSnap) => {
      const b = docSnap.data();

      if (b.status === "cancelled" || !b.confirmed) return;

      const bookingDate = dayjs(b.date);
      const amount = (b.price || 0) * 0.85;
      total += amount;

      if (
        bookingDate.isSameOrAfter(startOfWeek, "day") &&
        bookingDate.isSameOrBefore(today, "day")
      ) {
        weekTotal += amount;
      }

      let pending = false;

      // Cash → nurse owes site
      if (b.paymentMethod === "cash") {
        const siteShare = (b.price || 0) * 0.15;
        if (!b.cashRemitStatus || b.cashRemitStatus !== "received") {
          pending = true;
          sitePending += siteShare;
        }
      }

      // PayPal → site owes nurse
      if (b.paymentMethod === "paypal") {
        const nurseShare = (b.price || 0) * 0.85;
        if (!b.nursePaid) {
          pending = true;
          nursePending += nurseShare;
        }
      }

      items.push({
        ...b,
        date: b.date,
        client: b.userName || "Client",
        amount,
        pending,
      });
    });

    transactions.value = items.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    totalEarnings.value = total;
    earningsThisWeek.value = weekTotal;
    nurseOwed.value = nursePending;
    siteOwed.value = sitePending;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}
async function fetchNurseRewards(userId) {
  try {
    const rewardsRef = doc(db, "nurseRewards", userId);
    const docSnap = await getDoc(rewardsRef);

    if (!docSnap.exists()) {
      nursePoints.value = 0;
      rewardsEarned.value = [];
      return;
    }

    const data = docSnap.data();
    nursePoints.value = data.totalPoints || 0;

    const totalRewards = (data.rewards || []).reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    rewardsEarned.value = totalRewards;
  } catch (e) {
    console.error("Error fetching nurse rewards:", e);
  }
}

async function payCash() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("nurseId", "==", user.uid));
    const snapshot = await getDocs(q);

    const batchUpdates = [];

    snapshot.forEach((docSnap) => {
      const b = docSnap.data();
      if (b.status === "cancelled" || !b.confirmed) return;

      if (b.paymentMethod === "cash" && b.cashRemitStatus !== "received") {
        batchUpdates.push(
          setDoc(
            doc(db, "bookings", docSnap.id),
            { cashRemitStatus: "received" },
            { merge: true }
          )
        );
      }
    });

    await Promise.all(batchUpdates);
    alert("Site payments completed successfully!");
    await fetchEarnings(user.uid);
  } catch (e) {
    console.error(e);
  }
}

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchEarnings(user.uid);
      loadPaymentMethod(user.uid);
      fetchNurseRewards(user.uid);
    } else {
      loading.value = false;
    }
  });
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined");

*,
*::before,
*::after {
  box-sizing: border-box;
}
.dashboard-container {
  display: flex;
  flex-direction: row;
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
} /* Table setup without horizontal scroll */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* prevents overflow */
  word-wrap: break-word;
}
.points-card .material-symbols-outlined,
.rewards-card .material-symbols-outlined {
  cursor: pointer;
  font-size: 18px;
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
} /* Badge styling */
.paid-status {
  background-color: #e1f7e9;
  color: #28a745;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 13px;
} /* Mobile styles */
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
} /* Tablet styles */
@media (min-width: 768px) and (max-width: 1024px) {
  .card {
    flex: 1 1 calc(50% - 10px);
  }
  .main-content {
    padding: 30px;
  }
}
.payment-method-section select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.payment-method-section input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 10px;
  width: 100%;
}
.payment-method-section button {
  margin-top: 10px;
  padding: 10px;
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.payment-method-section button:hover {
  background-color: #67aef5ff;
}
input.paypal {
  border-color: #0070ba;
  background: #e7f3ff;
  max-width: 300px;
}
.cash-pay-btn {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.cash-pay-btn:hover {
  background-color: #ffb84d;
}
</style>
