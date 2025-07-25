<template>
  <div class="booking-information" v-if="!loading">
    <h1 class="title">Book a Nurse</h1>
    <p class="subtitle">
      You're booking with
      <strong>
        {{ nurseData?.personal?.firstNameEn || "..." }}
        {{ nurseData?.personal?.lastNameEn || "" }}
      </strong>
    </p>

    <div class="form-box">
      <!-- User Name -->
      <div class="form-item">
        <label for="userName">Your Name</label>
        <input
          type="text"
          id="userName"
          v-model="booking.userName"
          placeholder="Your full name"
          required
        />
      </div>

      <!-- Service Selection -->
      <div class="form-item">
        <label for="service">Select Service</label>
        <select
          id="service"
          v-model="booking.service"
          @change="updatePrice"
          required
        >
          <option disabled value="">Choose a service</option>
          <option
            v-for="service in nurseData?.professional.specialization || []"
            :key="service"
            :value="service"
          >
            {{ service }}
          </option>
        </select>
      </div>
      <!-- Location (readonly) -->
      <div class="form-item">
        <label>Location</label>
        <input
          type="text"
          :value="
            nurseData
              ? nurseData?.personal?.city + ', ' + nurseData?.personal?.area
              : ''
          "
          disabled
        />
      </div>

      <!-- User Address -->
      <div class="form-item">
        <label for="address">Your Address</label>
        <input
          type="text"
          id="address"
          v-model="booking.address"
          placeholder="e.g., 14th El Maadi street"
          required
        />
      </div>

      <!-- Date Selection -->
      <div class="form-item">
        <label for="date">Select Date</label>
        <input
          type="date"
          id="date"
          v-model="booking.date"
          :min="minDate"
          :max="maxDate"
          @change="handleDateChange"
          required
        />
      </div>

      <!-- Shift Selection -->
      <div class="form-item">
        <label for="shift">Select Time</label>
        <select id="shift" v-model="selectedShift">
          <option disabled value="">Select shift</option>
          <option
            v-for="shift in nurseData?.professional?.shifts || []"
            :key="shift"
            :value="shift"
          >
            {{ shift }}
          </option>
        </select>
      </div>

      <!-- From Time -->
      <div class="form-item" v-if="selectedShift">
        <label for="fromTime">From</label>
        <select id="fromTime" v-model="selectedFrom">
          <option disabled value="">Select start time</option>
          <option
            v-for="slot in fromOptions"
            :key="slot.from"
            :value="slot.from"
          >
            {{ slot.from }}
          </option>
        </select>
      </div>

      <!-- To Time -->
      <div class="form-item" v-if="selectedFrom">
        <label for="toTime">To</label>
        <select id="toTime" v-model="selectedTo">
          <option disabled value="">Select end time</option>
          <option v-for="slot in toOptions" :key="slot.to" :value="slot.to">
            {{ slot.to }}
          </option>
        </select>
      </div>

      <!-- Price Display -->
      <div class="form-item">
        <label>Price Calculation</label>
        <div v-if="calculatedPrice">
          <p v-if="detailedPriceDisplay">
            {{ detailedPriceDisplay }}
          </p>
        </div>
        <div v-else>
          <p>---</p>
        </div>
      </div>
      <div class="form-group">
        <label for="notes">Notes (optional):</label>
        <textarea
          id="notes"
          v-model="booking.notes"
          rows="4"
          placeholder="Write any notes or special instructions..."
          class="form-control"
        ></textarea>
      </div>

      <!-- Buttons -->
      <div class="actions">
        <button class="cancel" @click="$router.back()">Back</button>
        <button class="confirm" @click="proceedToPayment">
          Proceed to Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { shiftOptions } from "@/data/shiftOptions";
import { useUserStore } from "@/stores/userStore";
import { collection, query, where, getDocs } from "firebase/firestore";

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const nurseId = route.query.nurseId;
const selectedShift = ref("");
const selectedFrom = ref("");
const selectedTo = ref("");
function parseTimeTo24Hour(timeString) {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return [hours, minutes];
}

const totalHours = computed(() => {
  if (!selectedFrom.value || !selectedTo.value) return 0;

  const [fromHour, fromMin] = parseTimeTo24Hour(selectedFrom.value);
  const [toHour, toMin] = parseTimeTo24Hour(selectedTo.value);

  const fromTotalMinutes = fromHour * 60 + fromMin;
  let toTotalMinutes = toHour * 60 + toMin;

  // overnight
  if (toTotalMinutes <= fromTotalMinutes) {
    toTotalMinutes += 24 * 60; // add 24 hours
  }

  const diffInMinutes = toTotalMinutes - fromTotalMinutes;

  return diffInMinutes >= 60 ? diffInMinutes / 60 : 0;
});

const calculatedPrice = computed(() => {
  const hourlyRate = nurseData.value?.professional?.price || 0;
  return Math.ceil(hourlyRate * totalHours.value);
});

const fromOptions = computed(() => {
  if (!selectedShift.value) return [];
  return shiftOptions[selectedShift.value] || [];
});

const toOptions = computed(() => {
  if (!selectedFrom.value || !selectedShift.value) return [];
  const shift = shiftOptions[selectedShift.value];
  const fromIndex = shift.findIndex((slot) => slot.from === selectedFrom.value);
  return shift.slice(fromIndex);
});
const detailedPriceDisplay = computed(() => {
  const rate = nurseData.value?.professional?.price || 0;
  const hours = totalHours.value;
  if (!rate || !hours) return "";
  return `${rate} EGP × ${hours} hour${hours > 1 ? "s" : ""} = ${Math.ceil(
    rate * hours
  )} EGP`;
});
const booking = ref({
  userName: "",
  service: "",
  address: "",
  date: "",
  time: "",
  notes: "",
});

const nurseData = ref(null);
const loading = ref(true);
const availableTimes = ref([]);
const minDate = new Date().toISOString().split("T")[0];
const maxDate = new Date(new Date().setDate(new Date().getDate() + 14))
  .toISOString()
  .split("T")[0];

// جلب بيانات الممرضة
const fetchNurseData = async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    nurseData.value = docSnap.data();
  }
  loading.value = false;
};

const handleDateChange = () => {
  const selectedDate = new Date(booking.value.date);
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  if (!nurseData.value.professional.availableDays.includes(dayName)) {
    alert(`Nurse is not available on ${dayName}`);
    booking.value.date = "";
    return;
  }

  generateAvailableTimes();
};

const generateAvailableTimes = () => {
  const shifts = nurseData.value?.professional?.shifts;

  if (!shifts || !Array.isArray(shifts)) {
    availableTimes.value = [];
    return;
  }

  const slots = [];

  shifts.forEach((shift) => {
    const shiftSlots = shiftOptions[shift];
    if (shiftSlots) {
      shiftSlots.forEach(({ from, to }) => {
        slots.push(`${from} - ${to}`);
      });
    }
  });

  availableTimes.value = slots;
};

const proceedToPayment = () => {
  if (
    !booking.value.userName ||
    !booking.value.service ||
    !booking.value.address ||
    !booking.value.date ||
    !selectedShift.value ||
    !selectedFrom.value ||
    !selectedTo.value
  ) {
    alert("Please fill in all fields before proceeding.");
    return;
  }

  const nurseFullName = `${nurseData.value?.personal?.firstNameEn || ""} ${
    nurseData.value?.personal?.lastNameEn || ""
  }`.trim();

  const bookingData = {
    nurseId,
    nurseName: nurseFullName,
    nursePhone: nurseData.value?.personal?.phone || "",
    nurseEmail: nurseData.value?.personal?.email || "",

    userId: userStore.firebaseUser?.uid || "guest",
    userName: userStore.profileData?.fullName || "",
    userPhone: userStore.profileData?.phone || "",
    userEmail: userStore.profileData?.email || "",

    service: booking.value.service,
    address: booking.value.address,
    date: booking.value.date,
    shift: selectedShift.value,
    from: selectedFrom.value,
    to: selectedTo.value,
    totalHours: totalHours.value,
    price: calculatedPrice.value,
    notes: booking.value.notes,
  };
  const checkForConflict = async () => {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("nurseId", "==", nurseId),
      where("date", "==", booking.value.date),
      where("shift", "==", selectedShift.value)
    );

    const querySnapshot = await getDocs(q);
    const newFrom = parseTimeTo24Hour(selectedFrom.value);
    const newTo = parseTimeTo24Hour(selectedTo.value);
    const newStart = newFrom[0] * 60 + newFrom[1];
    const newEnd = newTo[0] * 60 + newTo[1];

    let conflictFound = false;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const existingFrom = parseTimeTo24Hour(data.from);
      const existingTo = parseTimeTo24Hour(data.to);
      const existingStart = existingFrom[0] * 60 + existingFrom[1];
      const existingEnd = existingTo[0] * 60 + existingTo[1];

      const overlap = Math.max(
        0,
        Math.min(newEnd, existingEnd) - Math.max(newStart, existingStart)
      );
      if (overlap > 0) {
        conflictFound = true;
      }
    });

    return conflictFound;
  };

  localStorage.setItem("bookingData", JSON.stringify(bookingData));
  checkForConflict().then((conflict) => {
    if (conflict) {
      alert("This time slot is already booked. Please choose another time.");
      return;
    }

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/bookingconfirmation");
  });
};

onMounted(fetchNurseData);
</script>

<style scoped>
.booking-information {
  padding: 40px;
  max-width: 800px;
  margin: auto;
  font-family: "Cairo", sans-serif;
}

.back-button {
  color: #19599a;
  cursor: pointer;
  font-weight: bold;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
}

.subtitle {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.form-box {
  margin-top: 30px;
  border-top: 1px solid #ccc;
  padding-top: 20px;
}

.form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-item label {
  font-weight: bold;
  margin-bottom: 6px;
}

.form-item input,
.form-item select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.actions {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.cancel {
  padding: 10px 20px;
  border: 1px solid #19599a;
  color: #19599a;
  background: white;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.cancel:hover {
  background-color: #19599a;
  color: white;
}

.confirm {
  background-color: #19599a;
  color: white;
  padding: 10px 25px;
  border: none;
  cursor: pointer;
}
form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  text-align: left;
}
label {
  font-weight: 777;
  color: #333;
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.3s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 4px rgba(74, 144, 226, 0.3);
}
</style>
