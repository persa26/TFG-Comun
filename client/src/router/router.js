import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/AddUserView.vue";
import UsersListView from "../views/UsersListView.vue";

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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
