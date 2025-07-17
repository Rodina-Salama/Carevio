import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "@/views/guest/HomePage.vue";
import AboutPage from "@/views/guest/AboutPage.vue";
import BrowseNurses from "@/views/guest/BrowseNurses.vue";
import ContactUs from "@/views/guest/ContactUs.vue";
import Services from "@/views/guest/Services.vue";
import SignIn from "@/views/guest/SignIn.vue";
import SignUp from "@/views/guest/SignUp.vue";
import JoinAsNurse from "@/views/guest/JoinAsNurse.vue";

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/about", name: "AboutPage", component: AboutPage },
  { path: "/browse", name: "BrowseNurses", component: BrowseNurses },
  { path: "/contact", name: "ContactUs", component: ContactUs },
  { path: "/signin", name: "SignIn", component: SignIn },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/services", name: "Services", component: Services },
  { path: "/join", name: "JoinAsNurse", component: JoinAsNurse },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
