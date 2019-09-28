import SDLC from 'sdlc';

import { itemNormalize, orderNormalize, routerNormalize } from '../normalize';
import { sort } from '../utils';

import Workbench from './Workbench';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

const store = {
	router: {
		path: '/workbench',
		component: Workbench,
		meta: {
			authencated: true
		},
		children: [
			{
				path: '',
				redirect: ''
			}
		]
	},
	nav: [],
	dropdown: []
};

SDLC.install('oc.com.sdlc.core.workbench', {
	Plugin({ appendRoutes, appendI18n, appendState }) {
		appendRoutes([store.router]);

		appendI18n({
			zh, en
		});
		
		appendState('nav', store.nav);
		appendState('dropdown', store.dropdown);
	},
	extender() {
		return {
			appendRoutes(newRoutes) {
				store.router.children =
					store.router.children.concat(routerNormalize(newRoutes));

				return this;
			},
			addNavItem(options) {
				const { id, path, label, icon } = itemNormalize(options);

				store.nav.push({
					id, path, label, icon
				});

				if (!store.router.children[0].redirect) {
					store.router.children[0].redirect = path;
				}

				return this;
			},
			addDropdownItem(options) {
				const { id, path, label } = itemNormalize(options);

				store.dropdown.push({
					id, path, label
				});

				return this;
			}
		};
	},
	decorator: {
		setNavOrder(options) {
			store.nav = sort(store.nav, orderNormalize(options));

			store.router.children[0].redirect = store.nav[0].path;
		},
		setDropdownOrder(options) {
			store.dropdown = sort(store.nav, orderNormalize(options));
		}
	}
});
