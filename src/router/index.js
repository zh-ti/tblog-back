import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Cookie from "lib/cookie/cookie";
import managerReq from "network/manager";

const routes = [
  {
    path: "/",
    redirect: "/manage",
  },
  {
    path: "/login",
    component: () => import("views/login/Login"),
  },
  {
    path: "/manage",
    component: () => import("views/main-view/MainView"),
    children: [
      {
        path: "",
        redirect: "systemInfo",
      },
      {
        path: "systemInfo",
        component: () => import("views/main/system/SystemInfo"),
      },
      {
        path: "frontSetting",
        component: () => import("views/main/system/FrontSetting"),
      },
      {
        path: "docCategory",
        component: () => import("views/main/document/DocCategory"),
      },
      {
        path: "docEdit",
        component: () => import("views/main/document/DocEdit"),
      },
      {
        path: "docEdit/:docId",
        component: () => import("views/main/document/DocEdit"),
      },
      {
        path: "docManage",
        component: () => import("views/main/document/DocManage"),
      },
      {
        path: "docDraft",
        component: () => import("views/main/document/DocDraft"),
      },
      {
        path: "adminManage",
        component: () => import("views/main/account/AdminManage"),
      },
      {
        path: "currentManager",
        component: () => import("views/main/account/CurrentManager"),
      },
    ],
  },
  {
    path: "*",
    redirect: "/manage",
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, form, next) => {
  const user = Cookie.get("account");
  if (to.path === "/login") return next();
  if (user) {
    managerReq
      .checkLogin(user)
      .then((result) => {
        if (result > 0) {
          next();
        } else {
          next("/login");
        }
      })
      .catch(() => {});
  } else {
    next("/login");
  }
});

export default router;
