import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

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
    ],
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});

import Cookie from "lib/cookie/cookie";
import managerReq from "network/manager";

router.beforeEach((to, form, next) => {
  const managerToken = Cookie.get("manager");
  if (to.path === "/login") return next();
  if (managerToken) {
    managerReq
      .checkLogin(managerToken)
      .then((result) => {
        if (!result.resultStatus.hasError) {
          next();
        } else {
          next({
            path: "/login",
            query: { message: result.resultStatus.reason },
          });
        }
      })
      .catch((err) => console.log(err));
  } else {
    next({ path: "/login", query: "请重新登录" });
  }
  next();
});

export default router;
