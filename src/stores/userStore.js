// src/stores/userStore.js
import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useUserStore = defineStore("user", {
  state: () => ({
    firebaseUser: null,
    profileData: null,
    type: null,
  }),

  actions: {
    async setUser(user, profile) {
      this.firebaseUser = user;
      this.type = profile.type; // nurse أو patient
      this.profileData = profile;
    },

    async fetchUserData(user) {
      try {
        await user.reload(); // ضروري علشان نجيب حالة الإيميل المحدثة

        if (!user.emailVerified) {
          console.warn("User email not verified. Skipping data fetch.");
          return;
        }

        const uid = user.uid;
        const docSnap = await getDoc(doc(db, "users", uid));

        if (docSnap.exists()) {
          const data = docSnap.data();
          this.setUser(user, data); // ✅ بس بعد التأكد من التفعيل
        } else {
          console.warn("User document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    clearUser() {
      this.firebaseUser = null;
      this.profileData = null;
      this.type = null;
    },
  },
});
