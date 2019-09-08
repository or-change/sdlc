import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/SignIn.vue';

export default function Router(pluginRouterOptions) {
	return new VueRouter({
		routes: [
			{
				path: '/',
				component: SignIn
			}
		].concat(pluginRouterOptions)
	});
}