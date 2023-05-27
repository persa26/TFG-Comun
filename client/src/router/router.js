import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/AddUserView.vue";
import UsersListView from "../views/UsersListView.vue";
import StudentsListView from "../views/StudentsListView.vue";
import GroupsListView from "../views/GroupsListView.vue";
import IdentificationListView from "../views/IdentificationListView.vue";
import LocationsListView from "../views/LocationsListView.vue";
import GroupLocationsListView from "../views/GroupLocationsListView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/users",
    name: "users",
    component: UsersListView,
  },
  {
    path: "/students",
    name: "students",
    component: StudentsListView,
  },
  {
    path: "/groups",
    name: "groups",
    component: GroupsListView,
  },
  {
    path: "/identification",
    name: "identification",
    component: IdentificationListView,
  },
  {
    path: "/locations",
    name: "locations",
    component: LocationsListView,
  },
  {
    path: "/grouplocations",
    name: "grouplocations",
    component: GroupLocationsListView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
