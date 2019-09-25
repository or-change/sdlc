import SDLC from 'sdlc';

import Signin from './SignIn.vue';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

const store = {
	path: '/signin',
	component: Signin
};

SDLC.install('oc.com.sdlc.core.signin', {
	Plugin({ appendRoutes, appendI18n }) {
		appendRoutes([
			{
				path: store.path,
				component: store.component
			}
		]);

		appendI18n({
			zh, en
		});
	},
	decorator: {
		setAuthenticationPath(path) {
			if (typeof path !== 'string') {
				throw new Error('String is Expected.');
			}

			store.path = path;
		},
		setAuthenticationComponent(componentOptions) {
			store.component = componentOptions;
		}
	}
});