import agent from 'http-agent';
import SDLCProductFactory from 'sdlc-product-factory';

import { store, generateResult } from './store';
import {
	routerNormalize, navItemNormalize, itemNormalize,
	topicNormalize, orderNormalize
} from './normalize';

function PluginExtender(pluginId) {
	return {
		appendRoutes(newRoutes) {
			store.workbench.routes = store.workbench.routes.concat(routerNormalize(newRoutes));
		
			return this;
		},
		addNavItem(options) {
			store.workbench.nav.items.push(navItemNormalize(options));

			return this;
		},
		addAccountItem(options) {
			store.workbench.account.items.push(itemNormalize(options));

			return this;
		},
		addAdminItem(options) {
			store.workbench.admin.items.push(itemNormalize(options));

			return this;
		},
		addTopicItem(options) {
			const { id, path, component, label, extend, target } = topicNormalize(options);

			if (target) {
				store.workbench.project.installers.push(target);
			}

			store.workbench.project.topics.push({ id, pluginId, path, label, component, extend });

			return this;
		}
	};
}

function Decorator() {
	return {
		appendRoutes(newRoutes) {
			store.global.routes = store.global.routes.concat(routerNormalize(newRoutes));
		
			return this;
		},
		setAuthenticationPage(componentOptions) {
			store.global.AuthenticationPage = componentOptions;
		
			return this;
		},
		setFooter(componentOptions) {
			store.global.Footer = componentOptions;
		
			return this;
		},
		setHome(routerPath) {
			store.global.home = routerPath;
		
			return this;
		},
		getItems(type) {
			return store.workbench[type].items.map(item => {
				return { path: item.path, label: item.label.sub };
			});
		},
		getTopics() {
			return store.workbench.project.topics.map(topic => {
				return { path: topic.path, label: topic.label.sub };
			});
		},
		setOrder(type, order) {
			store.workbench[type].order = orderNormalize(order);

			return this;
		}
	};
}

export default {
	install(id, PluginFactory) {
		if (store.installed) {
			throw new Error('Can NOT install after installed.');
		}

		store.plugins[id] = PluginFactory;
	},
	async compile() {
		if (store.compiled) {
			throw new Error('Duplicated compiling is NOT be allowed.');
		}
		
		store.installed = true;
		store.compiled = true;

		const { data } = await agent.get('/product');
		const plugins = data.plugins.map(plugin => plugin.id);

		Object.keys(store.plugins).forEach(pluginId => {
			if (plugins.indexOf(pluginId) === -1) {
				throw new Error(`plugin ${pluginId} is not registered.`);
			}

			store.plugins[pluginId](PluginExtender(pluginId));
		});

		store.workbench.project.installers.forEach(installer => {
			const { id, pluginId, install } = installer;

			const topic = store.workbench.project.topics.find(topic => topic.id === id && topic.pluginId === pluginId);

			if (topic && topic.install) {
				topic.extend(install);
			}
		});

		SDLCProductFactory(Decorator());

		return generateResult();
	}
};