import SDLC from 'sdlc';

import { orderNormalize, routerNormalize, topicNormalize } from '../normalize';
import { sort } from '../utils';

import Account from './Account';

const store = {
	router: [
		{
			path: 'account',
			component: Account,
			children: []
		}
	],
	topics: {
		items: [],
		order: []
	}
};

SDLC.install('oc.com.sdlc.core.workbench.account', {
	Plugin({ appendState }) {
		appendState('account.topics', sort(store.topics.items, store.topics.order));
	},
	extender() {
		return {
			appendRoutes(newRoutes) {
				store.router.children =
					store.router.children.concat(routerNormalize(newRoutes));
			
				return this;
			},
			appendTopics(options) {
				store.topics.items.push(topicNormalize(options));
			}
		};
	},
	installer: {
		id: 'oc.com.sdlc.core.workbench',
		install({ appendRoutes, addDropdownItem }) {
			appendRoutes(store.router);
			addDropdownItem({
				id: 'account',
				path: `account/${sort(store.topics.items, store.topics.order)[0]}`,
				label: ''
			});
		}
	},
	decorator: {
		setOrder(options) {
			store.topics.order = orderNormalize(options);
		}
	}
});