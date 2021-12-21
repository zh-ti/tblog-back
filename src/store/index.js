import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import docCategory from "data/docCategory";

const store = new Vuex.Store({
  state: {
    viewContent: "home",
    docCategory: docCategory,
  },
  actions: {
    changeViewContent(context, payload) {
      context.dispatch("changeViewContent", payload.viewContent);
    },
  },
  mutations: {
    changeViewContent(state, viewContent) {
      state.viewContent = viewContent;
    },
  },
});

export default store;
