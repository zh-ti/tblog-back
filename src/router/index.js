import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Cookie from "js-cookie";
import managerReq from "network/manager";

const routes = [
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
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, form, next) => {
  const user = Cookie.get("account");
  if (to.path === "/login") return next();
  const reg = /[.css]$|[.js]$|[.jpg]$|[.png]$|[.gif]$/;
  if (reg.test(to.path)) return next();
  if (user) {
    managerReq
      .checkLogin(JSON.parse(user).value)
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
