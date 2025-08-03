<template>
  <div class="not-found">
    <h1>404 - {{ $t("loading.pagenotfound") }}</h1>
    <router-link to="/"> {{ $t("loading.gotohome") }}</router-link>
  </div>
</template>
<style>
div {
  text-align: center;
}
</style>
