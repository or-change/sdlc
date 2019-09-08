import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		signedIn: false
	},
	actions: {
		async authenticate({ commit }) {
			// get principle
			commit('assignPrincipal', {});
		}
	},
	mutations: {
		assignPrincipal(state, principal) {}
	}
});