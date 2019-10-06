import SDLC from 'sdlc';

import { orderNormalize, routerNormalize, itemNormalize } from '../normalize';
import { sort } from '../utils';

import Project from './Project';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

const store = {
	router: {
		path: 'project/:projectId',
		component: Project,
		children: [
			{
				path: '',
				redirect: ''
			}
		]
	},
	topics: []
};

SDLC.install('oc.com.sdlc.core.workbench.project.retrive', {
	Plugin({ appendI18n, appendState }) {
		appendI18n({
			zh, en
		});

		appendState('project.topics', store.topics);
	},
	extender() {
		return {
			appendRoutes(newRoutes) {
				store.router.children =
					store.router.children.concat(routerNormalize(newRoutes));
			
				return this;
			},
			appendTopics(options) {
				store.topics.push(itemNormalize(options));

				if (!store.router.children[0].redirect) {
					store.router.children[0].redirect = 'property';
					// store.router.children[0].redirect = options.path;
				}
			}
		};
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench',
			install({ appendRoutes }) {
				appendRoutes([store.router]);
			}
		}
	],
	decorator: {
		setOrder(options) {
			store.topics = sort(store.topics, orderNormalize(options));

			store.router.children[0].redirect = 'property';
			// store.router.children[0].redirect = store.topics[0];
		}
	}
});