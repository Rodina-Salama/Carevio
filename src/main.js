import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@fortawesome/fontawesome-free/css/all.css";
import i18n from "./i18n";
const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

document.dir = i18n.global.locale.value === "ar" ? "rtl" : "ltr";
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount("#app");
