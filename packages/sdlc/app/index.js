import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.scss';

import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import http from './plugins/http';
import dateFormat from './plugins/dateFormat';
import customComponents from './components/utils';
import mixin from './components/mixin';

Vue.use(BootstrapVue);
Vue.use(http);
Vue.use(dateFormat);
Vue.use(customComponents);
Vue.mixin(mixin);

import App from './components/App';
import store from './store';
import Router from './router';
import I18n from './i18n';

import SDLC from 'sdlc';
import SDLCProductFactory from 'sdlc-product-factory';

async function bootstrap() {
	const options = await SDLC.compile(SDLCProductFactory);
	
	Vue.prototype.sdlc = options;

	const router = Router({
		routes: options.routes,
		AuthenticationPage: options.AuthenticationPage,
		home: options.home
	});
	
	router.beforeEach((to, from, next) => {
		if (to.matched.length === 0) {
			return next('/');
		}
	
		store.dispatch('authenticate').finally(() => {
			const signedIn = store.state.signedIn; //sign in state
		
			if (signedIn) {
				if (to.matched.find(match => match.meta.unauthencated === true)) {
					return next('/desktop');
				}
			} else {
				if (to.matched.find(match => match.meta.authencated === true)) {
					return next('/signin');
				}
			}
			
			next();
		});
	});

	const app = new Vue({ store, router, i18n: I18n(options.i18n), render: h => h(App) });

	app.$mount('#app');
}

window.addEventListener('load', bootstrap);