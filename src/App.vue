<template>
  <div id="app">
    <GuestNavbar />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import GuestNavbar from "@/components/navbar/GuestNavbar.vue";
import AppFooter from "@/components/AppFooter.vue";
export default {
  name: "App",
  components: {
    GuestNavbar,
    AppFooter,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Cairo&display=swap");

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
</style>
