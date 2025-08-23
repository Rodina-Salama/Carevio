<!-- src/views/nurse/NurseBookingDetails.vue -->
<template>
  <div class="booking-details">
    <button class="back-btn" @click="goBack">← {{ $t("booking.back") }}</button>
    <h1>{{ $t("booking.bookingDetails") }}</h1>
    <SMALL>{{ $t("myBookings.bookingId") }}: {{ bookingId }}</SMALL>

    <div v-if="loading">Loading...</div>
    <div v-else-if="booking">
      <ul>
        <li>
          <strong>{{ $t("booking.name") }}:</strong> {{ booking.userName }}
        </li>
        <li>
          <strong>{{ $t("booking.phone") }}:</strong> {{ booking.userPhone }}
        </li>
        <li>
          <strong>{{ $t("booking.date") }}:</strong> {{ booking.date }}
        </li>
        <li>
          <strong>{{ $t("booking.time") }}:</strong> {{ booking.from }} -
          {{ booking.to }}
        </li>
        <li>
          <strong>{{ $t("booking.service") }}:</strong>
          {{ $t(`data.specializations.${booking.service}`) }}
        </li>
        <li>
          <strong>{{ $t("booking.address") }}:</strong> {{ booking.address }}
        </li>
        <li>
          <strong>{{ $t("booking.notes") }}</strong>
          {{ booking.notes || $t("booking.noNotes") }}
        </li>
        <li>
          <strong>{{ $t("booking.payment") }}:</strong>
          {{ $t(`booking.${booking.paymentMethod}`) }}
        </li>
        <li>
          <strong>{{ $t("booking.price") }}:</strong> {{ booking.price }} EGP
        </li>
        <li>
          <strong>{{ $t("booking.createdAt") }}:</strong>
          {{ formatTimestamp(booking.createdAt) }}
        </li>
      </ul>
      <div class="arrival-photo-section">
        <h3>{{ $t("booking.arrivalPhoto") }}</h3>

        <div v-if="booking.arrivalPhotoUrl">
          <img
            :src="booking.arrivalPhotoUrl"
            alt="Arrival Photo"
            class="arrival-photo-preview"
          />
        </div>

        <input
          v-if="isActiveNow"
          type="file"
          id="arrivalPhotoInput"
          accept="image/*"
          @change="handleArrivalPhotoUpload"
          :disabled="uploading || arrivalConfirmed"
        />

        <p v-else>{{ $t("booking.confirmNotAvailable") }}</p>
      </div>
    </div>
    <div v-else>
      <p>Booking not found.</p>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import { addPointsToNurse } from "@/services/rewardsService";
import { arrayUnion, updateDoc } from "firebase/firestore";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const bookingId = route.params.id;

    const booking = ref(null);
    const loading = ref(true);
    const uploading = ref(false);

    const confirming = ref(false);
    const arrivalConfirmed = ref(false);
    const CLOUDINARY_UPLOAD_PRESET = "Nurse_information";
    const CLOUDINARY_UPLOAD_URL =
      "https://api.cloudinary.com/v1_1/dqa1o4xga/image/upload";

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return "N/A";
      const date = timestamp.toDate();
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    function convertTo24Hour(time12h) {
      const [time, modifier] = time12h.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }
      return [hours, minutes];
    }

    const isActiveNow = computed(() => {
      if (!booking.value) return false;

      const now = new Date();

      const [year, month, day] = booking.value.date.split("-").map(Number);
      if (!year || !month || !day) return false;

      const [fromHour, fromMinute] = convertTo24Hour(booking.value.from);
      const [toHour, toMinute] = convertTo24Hour(booking.value.to);

      const startDate = new Date(year, month - 1, day, fromHour, fromMinute);

      let endDate = new Date(year, month - 1, day, toHour, toMinute);
      if (toHour < fromHour || (toHour === fromHour && toMinute < fromMinute)) {
        endDate.setDate(endDate.getDate() + 1);
      }

      return now >= startDate && now <= endDate;
    });

    const fetchBooking = async () => {
      const docRef = doc(db, "bookings", bookingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        booking.value = docSnap.data();
        if (booking.value.arrivalPhotoUrl || booking.value.arrivalConfirmedAt) {
          arrivalConfirmed.value = true;
        }
      }
      loading.value = false;
    };

    const uploadImageToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
        return response.data.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        alert("Failed to upload image");
        return null;
      }
    };

    const handleArrivalPhotoUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      uploading.value = true;

      const url = await uploadImageToCloudinary(file);
      if (!url) {
        uploading.value = false;
        return;
      }

      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        uploading.value = false;
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const docRef = doc(db, "bookings", bookingId);
            await setDoc(
              docRef,
              {
                arrivalPhotoUrl: url,
                arrivalLocation: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  timestamp: new Date(),
                },
                arrivalConfirmedAt: new Date(),
                confirmed: true,
              },
              { merge: true }
            );
            booking.value.arrivalPhotoUrl = url;
            arrivalConfirmed.value = true;
            await addPointsToNurse(
              booking.value.nurseId,
              10,
              "completed_visit",
              {
                bookingId: bookingId,
              }
            );
            if (booking.value.userId) {
              const notifRef = doc(db, "notifications", booking.value.userId);
              await updateDoc(notifRef, {
                notifications: arrayUnion({
                  type: "review-reminder",
                  bookingId: bookingId,
                  userName: booking.value.userName || "",
                  nurseName: booking.value.nurseName || "",
                  message: {
                    en: `Reminder: please leave a review for your booking with ${booking.value.nurseName} on ${booking.value.date} from ${booking.value.from} to ${booking.value.to}.`,
                    ar: `تذكير:  يرجى ترك تقييم لحجزك مع ${booking.value.nurseName} يوم ${booking.value.date} من ${booking.value.from} إلى ${booking.value.to}.`,
                  },
                  isRead: false,
                  createdAt: new Date(),
                }),
              });
            }
          } catch (error) {
            console.error(error);
            alert("Failed to save arrival data");
          } finally {
            uploading.value = false;
          }
        },
        (error) => {
          alert("Error getting location: " + error.message);
          uploading.value = false;
        }
      );
    };

    const goBack = () => {
      router.push(`/NurseBookings`);
    };

    onMounted(fetchBooking);

    return {
      booking,
      loading,
      formatTimestamp,
      goBack,
      handleArrivalPhotoUpload,
      uploading,
      confirming,
      arrivalConfirmed,
      isActiveNow,
      convertTo24Hour,
      bookingId,
    };
  },
};
</script>

<style scoped>
.booking-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background-color: transparent;
  border: none;
  color: #19599a;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0;
  font-weight: 600;
}
.back-btn:hover {
  text-decoration: underline;
}

.booking-details ul {
  list-style: none;
  padding: 0;
}
.booking-details li {
  margin-bottom: 0.8rem;
  font-size: 1rem;
}
.booking-details strong {
  display: inline-block;
  width: 150px;
}
.arrival-photo-section {
  margin-top: 2rem;
}

.arrival-photo-preview {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  margin-bottom: 1rem;
}
</style>
