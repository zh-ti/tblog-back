import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loading: true,
    uploadImageUrl: "http://localhost:8088/tblog/upload/uploadImage",
  },
  actions: {
    changeLoadState(context, loadState) {
      context.commit("changeLoadState", loadState);
    },
  },
  mutations: {
    changeLoadState(state, loadState) {
      state.loading = loadState;
    },
  },
});

export default store;
