import SDLC from 'sdlc';

import { orderNormalize, routerNormalize, itemNormalize } from '../normalize';
import { sort } from '../utils';

import Admin from './Admin';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

const store = {
	router: {
		path: 'admin',
		component: Admin,
		children: []
	},
	topics: {
		items: [],
		order: []
	}
};

SDLC.install('oc.com.sdlc.core.workbench.admin', {
	Plugin({ appendState, appendI18n }) {
		appendState('admin.topics', sort(store.topics.items, store.topics.order));

		appendI18n({
			zh, en
		});
	},
	extender() {
		return {
			appendRoutes(newRoutes) {
				store.router.children =
					store.router.children.concat(routerNormalize(newRoutes));
			
				return this;
			},
			appendTopics(options) {
				store.topics.items.push(itemNormalize(options));
			}
		};
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench',
			install({ appendRoutes, addDropdownItem }) {
				appendRoutes([store.router]);
				addDropdownItem({
					id: 'admin',
					path: 'admin',
					label: 'admin.label'
				});
			}
		}
	],
	decorator: {
		setOrder(options) {
			store.topics.order = orderNormalize(options);
		}
	}
});