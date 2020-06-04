import Vue from 'vue';
import Vuex from 'vuex';
import user from './module/user';
import routeInfo from './module/routeInfo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    routeInfo
  }
});
