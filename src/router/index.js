import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "@/views/guest/HomePage.vue";
import AboutPage from "@/views/guest/AboutPage.vue";
import BrowseNurses from "@/views/guest/BrowseNurses.vue";
import ContactUs from "@/views/guest/ContactUs.vue";
import Services from "@/views/guest/Services.vue";
import SignIn from "@/views/guest/SignIn.vue";
import SignUp from "@/views/guest/SignUp.vue";
import JoinAsNurse from "@/views/nurse/JoinAsNurse.vue";
import SecondJoin from "@/views/nurse/SecondJoin.vue";
import ThirdJoin from "@/views/nurse/ThirdJoin.vue";
import FourthConfirm from "@/views/nurse/FourthConfirm.vue";
import NurseProfile from "@/views/nurse/NurseProfile.vue";
import UserProfile from "@/views/user/UserProfile.vue";
import EditProfile from "@/views/user/EditProfile.vue";
import ChangePassword from "@/views/user/ChangePassword.vue";
import DashBoard from "@/views/nurse/DashBoard.vue";
import NurseAvailability from "@/views/nurse/NurseAvailability.vue";
import NurseBookings from "@/views/nurse/NurseBookings.vue";
import NurseEdit from "@/views/nurse/NurseEdit.vue";
import NurseReviews from "@/views/nurse/NurseReviews.vue";
import NurseEarnings from "@/views/nurse/NurseEarnings.vue";
import BookingConfirmation from "@/views/BookingConfirmation/BookingConfirmation.vue";
import ForgotPassword from "@/views/guest/ForgotPassword.vue";
import MyBookings from "@/views/user/MyBookings.vue";
import bookingInformation from "@/views/BookingConfirmation/bookingInformation.vue";

const routes = [
  { path: "/", name: "HomePage", component: HomePage },
  { path: "/about", name: "AboutPage", component: AboutPage },
  { path: "/browse", name: "BrowseNurses", component: BrowseNurses },
  { path: "/contact", name: "ContactUs", component: ContactUs },
  { path: "/signin", name: "SignIn", component: SignIn },
  { path: "/signup", name: "SignUp", component: SignUp },
  { path: "/services", name: "Services", component: Services },
  { path: "/join", name: "JoinAsNurse", component: JoinAsNurse },
  { path: "/secondjoin", name: "SecondJoin", component: SecondJoin },
  { path: "/thirdjoin", name: "ThirdJoin", component: ThirdJoin },
  { path: "/confirm", name: "FourthConfirm", component: FourthConfirm },
  {
    path: "/nurse/:id",
    name: "NurseProfile",
    component: NurseProfile,
    props: true,
  },
  { path: "/userprofile", name: "UserProfile", component: UserProfile },
  { path: "/editprofile", name: "EditProfile", component: EditProfile },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/bookingconfirmation",
    name: "BookingConfirmation",
    component: BookingConfirmation,
  },

  {
    path: "/changepassword",
    name: "ChangePassword",
    component: ChangePassword,
  },
  { path: "/dashboard", name: "DashBoard", component: DashBoard },
  {
    path: "/nurseavailability",
    name: "NurseAvailability",
    component: NurseAvailability,
  },
  {
    path: "/bookinginformation",
    name: "BookingInformation",
    component: bookingInformation,
  },
  { path: "/nursebookings", name: "NurseBookings", component: NurseBookings },
  { path: "/nurseedit", name: "NurseEdits", component: NurseEdit },
  { path: "/nursereviews", name: "NurseReviews", component: NurseReviews },
  { path: "/nurseearnings", name: "NurseEarnings", component: NurseEarnings },
  { path: "/my-bookings", name: "MyBookings", component: MyBookings }, // ← NEW!
];
/* eslint-disable */
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
