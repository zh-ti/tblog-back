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
  {
    path: "/docEdit/:docId",
    component: () => import("views/main/document/DocEdit"),
  },
  {
    path: "/docManage",
    component: () => import("views/main/document/DocManage"),
  },
  {
    path: "/docDraft",
    component: () => import("views/main/document/DocDraft"),
  },
];

const router = new VueRouter({ routes, mode: "history" });

export default router;
