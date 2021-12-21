import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/systemInfo",
  },
  {
    path: "/systemInfo",
    component: () => import("views/main/system/SystemInfo"),
  },
  {
    path: "/docCategory",
    component: () => import("views/main/document/DocCategory"),
  },
  {
    path: "/docEdit",
    component: () => import("views/main/document/DocEdit"),
  },
];

const router = new VueRouter({ routes, mode: "history" });

export default router;
