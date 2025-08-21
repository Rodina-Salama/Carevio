<template>
  <LoadingSpinner v-if="loading" class="loading-wrapper" />
  <div class="booking-information" v-if="!loading">
    <h1 class="title">{{ $t("booking.title") }}</h1>
    <p
      v-if="!nurseData?.isVisible || nurseData?.isBanned"
      class="nurse-warning"
    >
      {{ $t("booking.notAvailable") }}
    </p>
    <p class="subtitle">
      {{ $t("booking.bookingWith") }}
      <strong>
        {{ nurseData?.personal?.firstNameEn || "..." }}
        {{ nurseData?.personal?.lastNameEn || "" }}
      </strong>
    </p>

    <div class="form-box">
      <!-- User Name -->
      <div class="form-item">
        <label for="userName">{{ $t("booking.yourName") }}</label>
        <input
          type="text"
          id="userName"
          v-model="booking.userName"
          :placeholder="$t('booking.placeholderName')"
          required
        />
      </div>

      <!-- Service Selection -->
      <div class="form-item">
        <label for="service">{{ $t("booking.selectService") }}</label>
        <select
          id="service"
          v-model="booking.service"
          @change="updatePrice"
          required
        >
          <option disabled value="">{{ $t("booking.chooseService") }}</option>
          <option
            v-for="service in nurseData?.professional.specialization || []"
            :key="service"
            :value="service"
          >
            {{ $t(`data.specializations.${service}`) }}
          </option>
        </select>
      </div>
      <!-- Location (readonly) -->
      <div class="form-item">
        <label>{{ $t("booking.location") }}</label>
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
        <label for="address">{{ $t("booking.yourAddress") }}</label>
        <input
          type="text"
          id="address"
          v-model="booking.address"
          :placeholder="$t('booking.placeholderAddress')"
          required
          disabled
        />
        <div
          id="map"
          style="height: 300px; margin-top: 10px; border-radius: 8px"
        ></div>
      </div>

      <!-- Date Selection -->
      <div class="form-item">
        <label for="date">{{ $t("booking.selectDate") }}</label>
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
        <label for="shift">{{ $t("booking.selectTime") }}</label>
        <select id="shift" v-model="selectedShift">
          <option disabled value="">{{ $t("booking.selectShift") }}</option>
          <option
            v-for="shift in nurseData?.professional?.shifts || []"
            :key="shift"
            :value="shift"
          >
            {{ $t(`data.shifts.${shift}`) }}
          </option>
        </select>
      </div>

      <!-- From Time -->
      <div class="form-item" v-if="selectedShift">
        <label for="fromTime">{{ $t("booking.from") }}</label>
        <select id="fromTime" v-model="selectedFrom">
          <option disabled value="">
            {{ $t("booking.selectStartTime") }}
          </option>
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
        <label for="toTime">{{ $t("booking.to") }}</label>
        <select id="toTime" v-model="selectedTo">
          <option disabled value="">{{ $t("booking.selectEndTime") }}</option>
          <option v-for="slot in toOptions" :key="slot.to" :value="slot.to">
            {{ slot.to }}
          </option>
        </select>
      </div>

      <!-- Price Display -->
      <div class="form-item">
        <label>{{ $t("booking.priceCalculation") }}</label>
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
        <label for="notes">{{ $t("booking.notes") }}:</label>
        <textarea
          id="notes"
          v-model="booking.notes"
          rows="4"
          :placeholder="$t('booking.placeholderNotes')"
          class="form-control"
        ></textarea>
      </div>
      <div class="noteInfo">
        {{ $t("booking.noteInfo") }}
      </div>
      <!-- Buttons -->
      <div class="actions">
        <button class="cancel" @click="$router.back()">
          {{ $t("booking.back") }}
        </button>
        <button class="confirm" @click="proceedToPayment">
          {{ $t("booking.proceed") }}
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
import { useI18n } from "vue-i18n";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { onBeforeUnmount } from "vue";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const nurseId = route.query.nurseId;
const selectedShift = ref("");
const selectedFrom = ref("");
const selectedTo = ref("");
const address = ref("");
const map = ref(null);
const marker = ref(null);
const selectedLatLng = ref(null);

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

const fetchNurseData = async () => {
  const docRef = doc(db, "applications", nurseId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    nurseData.value = docSnap.data();
  }
  loading.value = false;
};
function convertTo24HourFormat(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
}

const handleDateChange = () => {
  const selectedDate = new Date(booking.value.date);
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  if (!nurseData.value.professional.availableDays.includes(dayName)) {
    alert(`${t("booking.notAvailableOnDay")} ${dayName}`);
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
  if (!nurseData.value?.isVisible || nurseData.value?.isBanned) {
    alert(t("booking.nurseBlocked"));
    return;
  }
  if (
    !booking.value.userName ||
    !booking.value.service ||
    !booking.value.address ||
    !booking.value.date ||
    !selectedShift.value ||
    !selectedFrom.value ||
    !selectedTo.value
  ) {
    alert(t("booking.fillAllFields"));
    return;
  }
  const selectedDateTime = new Date(
    `${booking.value.date}T${convertTo24HourFormat(selectedFrom.value)}`
  );
  const now = new Date();

  const diffInMs = selectedDateTime - now;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (selectedDateTime < now) {
    alert(t("booking.timePassed"));
    return;
  }
  if (diffInHours < 2) {
    alert(t("booking.bookInAdvance"));
    return;
  }
  const nurseFullName = `${nurseData.value?.personal?.firstNameEn || ""} ${
    nurseData.value?.personal?.lastNameEn || ""
  }`.trim();
  booking.value.address = address.value;

  const bookingData = {
    nurseId,
    nurseName: nurseFullName,
    nursePhone: nurseData.value?.personal?.phone || "",
    nurseEmail: nurseData.value?.personal?.email || "",
    isRead: false,
    isReadnurse: false,
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
    location: selectedLatLng.value
      ? {
          latitude: selectedLatLng.value.lat,
          longitude: selectedLatLng.value.lng,
        }
      : null,
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
    let newStart = newFrom[0] * 60 + newFrom[1];
    let newEnd = newTo[0] * 60 + newTo[1];
    if (newEnd <= newStart) {
      newEnd += 24 * 60;
    }

    let conflictFound = false;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.cancelled === true) {
        return;
      }

      const existingFrom = parseTimeTo24Hour(data.from);
      const existingTo = parseTimeTo24Hour(data.to);
      let existingStart = existingFrom[0] * 60 + existingFrom[1];
      let existingEnd = existingTo[0] * 60 + existingTo[1];
      if (existingEnd <= existingStart) {
        existingEnd += 24 * 60;
      }

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
      alert(t("booking.bookingConflict"));
      return;
    }

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    router.push("/bookingconfirmation");
  });
};
async function fetchAddress(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "";
  }
}

async function fetchLatLngFromAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching lat/lng:", error);
    return null;
  }
}

onMounted(async () => {
  await fetchNurseData();

  let initialAddress = "";
  if (nurseData.value) {
    if (nurseData.value.personal.city && nurseData.value.personal.area) {
      initialAddress = `${nurseData.value.personal.city}, ${nurseData.value.personal.area}`;
    } else if (nurseData.value.personal.government) {
      initialAddress = nurseData.value.personal.government;
    }
  }

  let initialLatLng = { lat: 30.0444, lng: 31.2357 };

  if (initialAddress) {
    const coords = await fetchLatLngFromAddress(initialAddress);
    if (coords) {
      initialLatLng = coords;
    }
  }
  if (map.value) {
    map.value.remove();
    map.value = null;
  }

  map.value = L.map("map").setView([initialLatLng.lat, initialLatLng.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map.value);

  marker.value = L.marker([initialLatLng.lat, initialLatLng.lng], {
    draggable: true,
  }).addTo(map.value);

  address.value = initialAddress;

  marker.value.on("dragend", async (e) => {
    const pos = e.target.getLatLng();
    selectedLatLng.value = pos;
    const newAddress = await fetchAddress(pos.lat, pos.lng);
    address.value = newAddress;
    booking.value.address = newAddress;
  });
});
onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
    map.value = null;
  }
});
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
.noteInfo {
  font-weight: bold;
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
  background-color: #67aef5ff;
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
}
label {
  font-weight: 777;
  color: #333;
  display: block;
  margin-bottom: 5px;
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
.nurse-warning {
  color: red;
  font-size: 14px;
  margin-top: 8px;
}
</style>
