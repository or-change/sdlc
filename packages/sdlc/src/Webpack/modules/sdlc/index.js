import axios from 'axios';
import SDLCProductFactory from 'sdlc-product-factory';

import { store, generateResult } from './store';
import {
	routerNormalize, navNormalize, itemNormalize,
	topicNormalize, orderNormalize
} from './normalize';

const DEFAULT_PLUGINID = [
	'oc.com.sdlc.core', 'oc.com.sdlc.assemble'
];

const agent = axios.create({
	baseURL: '/api'
});

function PluginExtender(pluginId) {
	return {
		appendRoutes(newRoutes) {
			store.workbench.routes = store.workbench.routes.concat(routerNormalize(newRoutes));
		
			return this;
		},
		appendI18n(options) {
			Object.keys(options).forEach(key => {
				store.global.i18n[key] = store.global.i18n[key] ?
					store.global.i18n[key].concat(options[key]) : options[key];
			});

			return this;
		},
		addNavItem(options) {
			const navItem = navNormalize(options);
			navItem.pluginId = pluginId;

			store.workbench.nav.items.push(navItem);

			return this;
		},
		addAccountItem(options) {
			const accountItem = itemNormalize(options);
			accountItem.pluginId = pluginId;

			store.workbench.account.items.push(accountItem);

			return this;
		},
		addAdminItem(options) {
			const adminItem = itemNormalize(options);
			adminItem.pluginId = pluginId;

			store.workbench.admin.items.push(adminItem);

			return this;
		},
		addTopicItem(options) {
			const {
				id, component, label, extend, target, items, ownerOnly
			} = topicNormalize(options);

			if (target) {
				store.workbench.project.installers.push(target);
			}

			store.workbench.project.topics.push({
				id, pluginId, label, component, extend, items, ownerOnly
			});

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
		setOrder(type, order) {
			store.workbench[type].order = orderNormalize(order);

			return this;
		},
		pluginExtender: PluginExtender(DEFAULT_PLUGINID[1])
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
		const plugins = data.plugins.map(plugin => plugin.id).concat(DEFAULT_PLUGINID);

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