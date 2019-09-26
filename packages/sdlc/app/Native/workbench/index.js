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
		children: []
	},
	nav: {
		items: [],
		order: []
	},
	dropdown: {
		items: [],
		order: []
	}
};

SDLC.install('oc.com.sdlc.core.workbench', {
	Plugin({ appendRoutes, appendI18n, appendState }) {
		appendRoutes([store.router]);

		appendI18n({
			zh, en
		});
		
		appendState('nav', store.nav.items);
		appendState('dropdown', store.dropdown.items);
	},
	extender() {
		return {
			appendRoutes(newRoutes) {
				store.router.children =
					store.router.children.concat(routerNormalize(newRoutes));

				return this;
			},
			addNavItem(options) {
				const { id, path, label } = itemNormalize(options);

				store.nav.items.push({
					id, path, label
				});

				return this;
			},
			addDropdownItem(options) {
				const { id, path, label } = itemNormalize(options);

				store.dropdown.items.push({
					id, path, label
				});

				return this;
			}
		};
	},
	decorator: {
		setNavOrder(options) {
			store.nav.order = orderNormalize(options);

			store.nav.items = sort(store.nav.items, store.nav.order);
		},
		setDropdownOrder(options) {
			store.dropdown.order = orderNormalize(options);

			store.dropdown.items = sort(store.nav.items, store.nav.order);
		}
	}
});
