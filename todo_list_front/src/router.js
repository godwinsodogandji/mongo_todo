import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../src/components/Calendar.vue"),
  },
  {
    path: "/register",
    component: () => import("../src/components/Register.vue"),
  },
  {
    path: "/login",
    component: () => import("../src/components/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
