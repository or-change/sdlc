import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import './style.css';

import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import http from './plugins/http';
import extension from './plugins/extension';
import dateFormat from './plugins/dateFormat';
import customComponents from './components/utils';

import mixin from './components/mixin';

Vue.use(BootstrapVue);
Vue.use(http);
Vue.use(extension);
Vue.use(dateFormat);
Vue.use(customComponents);

Vue.mixin(mixin);

import App from './components/App.vue';
import store from './store';
import Router from './router';

const router = Router(Vue.prototype.$extension.routerOptions);

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

const app = new Vue({ store, router, render: h => h(App) });

window.addEventListener('load', function () {
	app.$mount('#app');
});
