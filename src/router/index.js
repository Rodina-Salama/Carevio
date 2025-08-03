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
import NurseBookings from "@/views/nurse/NurseBookings.vue";
import NurseEdit from "@/views/nurse/NurseEdit.vue";
import NurseReviews from "@/views/nurse/NurseReviews.vue";
import NurseEarnings from "@/views/nurse/NurseEarnings.vue";
import BookingConfirmation from "@/views/BookingConfirmation/BookingConfirmation.vue";
import ForgotPassword from "@/views/guest/ForgotPassword.vue";
import MyBookings from "@/views/user/MyBookings.vue";
import bookingInformation from "@/views/BookingConfirmation/bookingInformation.vue";
import NurseBookingDetail from "@/views/nurse/NurseBookingDetail.vue";
import NotAuthorized from "@/views/NotAuthorized.vue";
import ChangePasswordnurse from "@/views/nurse/ChangePasswordnurse.vue";
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
    path: "/changepassword",
    name: "ChangePassword",
    component: ChangePassword,
  },
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
    path: "/bookinginformation",
    name: "BookingInformation",
    component: bookingInformation,
  },
  { path: "/dashboard", name: "DashBoard", component: DashBoard },
  { path: "/nursebookings", name: "NurseBookings", component: NurseBookings },
  { path: "/nurseedit", name: "NurseEdit", component: NurseEdit },
  { path: "/nursereviews", name: "NurseReviews", component: NurseReviews },
  { path: "/nurseearnings", name: "NurseEarnings", component: NurseEarnings },
  { path: "/my-bookings", name: "MyBookings", component: MyBookings },
  {
    path: "/NurseBookings/:id",
    name: "NurseBookingDetail",
    component: NurseBookingDetail,
  },
  { path: "/unauthorized", name: "NotAuthorized", component: NotAuthorized },
  {
    path: "/changepasswordnurse",
    name: "ChangePasswordnurse",
    component: ChangePasswordnurse,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

import { useUserStore } from "@/stores/userStore";

// Route Guard: Protect routes for nurses only
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const protectedNurseRoutes = [
    "/dashboard",
    "/nursebookings",
    "/nurseedit",
    "/nursereviews",
    "/nurseearnings",
    "/changepasswordnurse",
  ];

  const isProtectedStatic = protectedNurseRoutes.includes(to.path);
  const isProtectedDynamic =
    to.path.startsWith("/NurseBookings/") || to.name === "NurseBookingDetail";

  const isLoggedIn = !!userStore.firebaseUser;
  const isNurse = isLoggedIn && userStore.type === "nurse";

  //  Block access to guest-only routes for logged-in users (nurse or patient)
  const guestOnlyRoutes = [
    "/signup",
    "/signin",
    "/join",
    "/secondjoin",
    "/thirdjoin",
    "/confirm",
  ];
  const protectedUserRoutes = [
    "/userprofile",
    "/editprofile",
    "/changepassword",
    "/my-bookings",
    "/bookingconfirmation",
    "/bookinginformation",
  ];
  const isUser = isLoggedIn && userStore.type === "user";

  const isGuestOnly = guestOnlyRoutes.includes(to.path);

  if (isGuestOnly && isLoggedIn) {
    return next("/unauthorized");
  }

  //  Block nurse-only routes if user is not a nurse
  if (isProtectedStatic || isProtectedDynamic) {
    if (!isNurse) {
      return next("/unauthorized");
    }
  }
  if (protectedUserRoutes.includes(to.path) && !isUser) {
    return next("/unauthorized");
  }
  // Allow route
  next();
});

export default router;
