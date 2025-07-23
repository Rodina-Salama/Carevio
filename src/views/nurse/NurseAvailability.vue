<template>
  <div class="dashboard-container">
    <div class="content-wrapper">
      <NurseSidebar />
      <div class="main-content">
        <h1 class="title">Availability</h1>
        <p class="subtitle">
          Manage your availability and view booked time slots.
        </p>

        <!-- Calendar -->
        <div class="calendar-container">
          <div class="calendar-header">
            <button @click="prevMonth">‹</button>
            <span>{{ months[currentMonth] }} {{ currentYear }}</span>
            <button @click="nextMonth">›</button>
          </div>

          <div class="calendar-grid">
            <div class="day" v-for="day in days" :key="day">{{ day }}</div>
            <div
              class="date"
              v-for="date in getCalendarDays(currentYear, currentMonth)"
              :key="date.fullDate"
              :class="{ selected: selectedDates.includes(date.fullDate) }"
              @click="toggleDate(date.fullDate)"
            >
              {{ date.day }}
            </div>
          </div>
        </div>

        <!-- Availability Settings -->
        <div class="availability-settings">
          <h3>Availability Settings</h3>
          <div class="input-group">
            <label>Selected Days:</label>
            <input type="text" :value="selectedDates.join(', ')" disabled />
          </div>
          <div class="time-group">
            <label>Available hours</label>
            <select v-model="startTime">
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
            </select>
            <span>to</span>
            <select v-model="endTime">
              <option>4:00 PM</option>
              <option>5:00 PM</option>
              <option>6:00 PM</option>
            </select>
          </div>
          <button class="save-btn" @click="saveAvailability">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NurseSidebar from "@/components/NurseSidebar.vue";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
  components: {
    NurseSidebar,
  },
  data() {
    return {
      days: ["S", "M", "T", "W", "T", "F", "S"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDates: [],
      startTime: "10:00 AM",
      endTime: "4:00 PM",
      nurseId: "nurse123",
    };
  },
  async mounted() {
    await this.loadAvailability();

    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
  },
  beforeUnmount() {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "block";
  },
  methods: {
    getCalendarDays(year, month) {
      const days = [];
      const firstDay = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        days.push({ day: "", fullDate: "" });
      }
      for (let i = 1; i <= totalDays; i++) {
        const fullDate = `${year}-${month + 1}-${i}`;
        days.push({ day: i, fullDate });
      }
      return days;
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    toggleDate(date) {
      if (!date) return;
      this.selectedDates = this.selectedDates.includes(date)
        ? this.selectedDates.filter((d) => d !== date)
        : [...this.selectedDates, date];
    },
    async loadAvailability() {
      const docRef = doc(db, "availability", this.nurseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.selectedDates = data.dates || [];
        this.startTime = data.startTime || "10:00 AM";
        this.endTime = data.endTime || "4:00 PM";
      }
    },
    async saveAvailability() {
      const docRef = doc(db, "availability", this.nurseId);
      await setDoc(docRef, {
        nurseId: this.nurseId,
        dates: this.selectedDates,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      alert("Availability saved to Firebase!");
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
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
  margin-bottom: 8px;
}

.subtitle {
  color: #555;
  margin-bottom: 24px;
}

.calendar-container {
  max-width: 650px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.calendar-header button {
  background-color: #19599a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.calendar-header button:hover {
  background-color: #19599a;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  text-align: center;
}

.day {
  font-weight: 600;
  color: #888;
  font-size: 14px;
}

.date {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.date:hover {
  background: #e0f0ff;
  transform: scale(1.05);
}

.date.selected {
  background: linear-gradient(to right, #19599a, #19599a);
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.availability-settings {
  max-width: 650px;
  margin: 40px auto 0;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.input-group,
.time-group {
  margin-bottom: 16px;
}

input,
select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.save-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
