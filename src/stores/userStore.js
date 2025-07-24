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
      const uid = user.uid;
      const docSnap = await getDoc(doc(db, "users", uid));

      if (docSnap.exists()) {
        const data = docSnap.data();
        this.setUser(user, data);
      }
    },

    clearUser() {
      this.firebaseUser = null;
      this.profileData = null;
      this.type = null;
    },
  },
});
