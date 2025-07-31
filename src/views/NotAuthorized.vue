<template>
  <div class="not-authorized">
    <h2>{{ $t("loading.unauthorizedtitle") }}</h2>
    <p>{{ $t("loading.unauthorizedredirectMessage") }}</p>
  </div>
  <br />
  <br />
  <br />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/");
  }, 3000);
});
</script>

<style scoped>
.not-authorized {
  text-align: center;
  margin-top: 100px;
}
</style>
