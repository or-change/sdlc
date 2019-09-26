import SDLC from 'sdlc';

import { orderNormalize, routerNormalize, itemNormalize } from '../normalize';
import { sort } from '../utils';

import Account from './Account';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

const store = {
	router: {
		path: 'account',
		component: Account,
		children: []
	},
	topics: {
		items: [],
		order: []
	}
};

SDLC.install('oc.com.sdlc.core.workbench.account', {
	Plugin({ appendState, appendI18n }) {
		appendState('account.topics', store.topics.items);

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
					id: 'account',
					path: 'account',
					label: 'account.label'
				});
			}
		}
	],
	decorator: {
		setOrder(options) {
			store.topics.order = orderNormalize(options);

			store.topics.items = sort(store.topics.items, store.topics.order);
		}
	}
});