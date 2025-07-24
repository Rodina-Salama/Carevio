<template>
  <div id="app">
    <GuestNavbar v-if="!userType" />
    <UserNavbar v-else-if="userType === 'user'" />
    <NurseNavbar v-else-if="userType === 'nurse'" />
    <router-view />
    <chat-bot></chat-bot>
    <AppFooter v-if="!isNurseRoute" />
  </div>
</template>

<script>
import GuestNavbar from "@/components/navbar/GuestNavbar.vue";
import UserNavbar from "@/components/navbar/UserNavbar.vue";
import NurseNavbar from "@/components/navbar/NurseNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
import ChatBot from "@/components/ChatBot.vue";
import { useUserStore } from "@/stores/userStore";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";

export default {
  name: "App",
  components: {
    GuestNavbar,
    UserNavbar,
    NurseNavbar,
    AppFooter,
    ChatBot,
  },
  setup() {
    const userStore = useUserStore();
    const isUserTypeLoaded = computed(
      () => userStore.firebaseUser !== null || userStore.type !== null
    );
    const userType = computed(() => userStore.type);
    const route = useRoute();
    const isNurseRoute = computed(() => route.path.startsWith("/nurse"));

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user && !userStore.firebaseUser) {
          await userStore.fetchUserData(user);
        }
      });
    });

    return {
      userType,
      isUserTypeLoaded,
      isNurseRoute,
    };
  },
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cairo&display=swap");

:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --button-color: #19599a;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

button {
  background-color: var(--button-color);
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#app {
  font-family: "Cairo", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.dropdown-menu a,
.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: left;
  background-color: white;
  border: none;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #f0f0f0;
}
</style>
