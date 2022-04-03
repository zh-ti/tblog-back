import Vue from "vue";
import App from "./App.vue";

import store from "@/store/index.js";
import router from "@/router/index.js";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import SlideVerify from "lib/slide-verify";
import VueCookie from "vue-cookies";

import VueRouter from "vue-router";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve || reject)
    return originalPush.call(this, location, resolve, reject);
  return originalPush.call(this, location).catch((err) => console.log(err));
};

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(SlideVerify);
Vue.use(VueCookie);

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
