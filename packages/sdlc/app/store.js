import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		signedIn: false,
		principal: {
			name: null,
			id: null,
			administrator: false
		}
	},
	actions: {
		async authenticate(context) {
			// get principle
			context.commit('initPrincipal');

			const principal = await Vue.prototype.$http.principal.get();

			context.commit('assignPrincipal', principal);
		}
	},
	mutations: {
		assignPrincipal(state, principal) {
			const { name, id, administrator } = principal.account;
			state.signedIn = true;
			state.principal.name = name;
			state.principal.id = id;
			state.principal.administrator = administrator;
		},
		initPrincipal(state) {
			state.signedIn = false;
			state.principal = {
				name: null,
				id: null,
				administrator: false
			}
		}
	}
});