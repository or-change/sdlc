import SDLC from 'sdlc';

import { orderNormalize, routerNormalize, topicNormalize } from '../normalize';
import { sort } from '../utils';

import Admin from './Admin';

const store = {
	router: [
		{
			path: 'admin',
			component: Admin,
			children: []
		}
	],
	topics: {
		items: [],
		order: []
	}
};

SDLC.install('oc.com.sdlc.core.workbench.admin', {
	Plugin({ appendState }) {
		appendState('admin.topics', sort(store.topics.items, store.topics.order));
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
				id: 'admin',
				path: `admin/${sort(store.topics.items, store.topics.order)[0]}`,
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