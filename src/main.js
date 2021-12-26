import Vue from "vue";
import App from "./App.vue";

import store from "@/store/index.js";
import router from "@/router/index.js";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import SlideVerify from "lib/slide-verify";
import VueCookie from "vue-cookies";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(SlideVerify);
Vue.use(VueCookie);

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
