import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';


import BootstrapVue from 'bootstrap-vue';
import http from './plugins/http';
import dateFormat from './plugins/dateFormat';
import showToast from './plugins/showToast';

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(http);
Vue.use(dateFormat);
Vue.use(showToast);

import App from './App';
import store from './store';
import I18n from './i18n';

import SDLC from 'sdlc';
import SDLCProductFactory from 'sdlc-product-factory';

async function bootstrap() {
	const options = await SDLC.compile(SDLCProductFactory);
	
	Vue.prototype.state = options.state;

	const router = new VueRouter({
		routes: options.routes
	});
	
	router.beforeEach((to, from, next) => {
		if (to.matched.length === 0) {
			return next(options.home);
		}
	
		store.dispatch('authenticate').finally(() => {
			const signedIn = store.state.signedIn; //sign in state
		
			if (signedIn) {
				if (to.matched.find(match => match.meta.unauthencated === true)) {
					return next(options.home);
				}
			} else {
				if (to.matched.find(match => match.meta.authencated === true)) {
					return next(options.authentication);
				}
			}
			
			next();
		});
	});

	const app = new Vue({ store, router, i18n: I18n(options.i18n), render: h => h(App) });

	app.$mount('#app');
}

window.addEventListener('load', bootstrap);