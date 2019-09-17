const store = window.store = {
	installed: false,
	compiled: false,
	plugins: {},
	global: {
		AuthenticationPage: null,
		Footer: null,
		home: '/',
		routes: []
	},
	workbench: {
		routes: [],
		nav: {
			order: [],
			items: []
		},
		account: {
			order: [],
			items: [] //add account
		},
		admin: {
			order: [],
			items: [] //add admin
		},
		project: {
			order: [],
			topics: [], //add project id
			installers: []
		}
	}
};

// TODO normalize， 全部信息排序，部分去掉pluginId id

function PluginExtender(pluginId) {
	return {
		appendRoutes(newRoutes) {
			const { routes } = store.workbench;
		
			store.workbench.routes = routes.concat(newRoutes);
		
			return this;
		},
		addNavItem(options) {
			const { id, component, label, path } = options;

			store.workbench.nav.items.push({ id, component, label, path, pluginId });

			return this;
		},
		addAccountItem(options) {
			const { id, component, label } = options;

			store.workbench.account.items.push({ id, component, label, pluginId });

			return this;
		},
		addAdminItem(options) {
			const { id, component, label } = options;

			store.workbench.admin.items.push({ id, component, label, pluginId });

			return this;
		},
		addTopicItem(options) {
			const { id, component, label, install, target, extend } = options;

			if (target && extend) {
				store.workbench.project.installers.push({ target, extend });
			}

			store.workbench.project.topics.push({ id, component, label, install, pluginId });

			return this;
		}
	};
}

function Decorator() {
	return {
		appendRoutes(newRoutes) {
			const { routes } = store.global;
		
			store.global.routes = routes.concat(newRoutes);
		
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
			store.workbench[type].order = order;

			return this;
		}
	};
}

function sort(items, order) {
	const result = [];

	order.forEach(id => {
		const item = items.find(item => item.id === id);

		result.push(item);
	});

	return result;
}

export default {
	install(id, PluginFactory) {
		if (store.installed) {
			throw new Error('Can NOT install after instaled.');
		}

		store.plugins[id] = PluginFactory; //记录插件信息？？
	},
	async compile(SDLCProductFactory) {
		if (store.compiled) {
			throw new Error('Duplicated compiling is NOT be allowed.');
		}
		
		store.installed = true;

		// 判断插件是否注册过

		Object.keys(store.plugins).forEach(pluginId => {
			store.plugins[pluginId](PluginExtender(pluginId)); //实例化插件
		});

		SDLCProductFactory(Decorator());

		const { global, workbench } = store;
		const { nav, account, admin, project } = workbench;

		project.installers.forEach(installer => {
			const { target } = installer;

			console.log(project.topics,target);

			const topic = project.topics.find(topic => topic.id === target.id && topic.pluginId === target.pluginId);

			if (topic && topic.install) {
				topic.install(installer.extend);
			}
		});


		const result = {
			routes: {
				global: global.routes,
				workbench: workbench.routes,
				account: [],
				admin: [],
				project: []
			},
			AuthenticationPage: global.AuthenticationPage,
			Footer: global.Footer,
			home: global.home,
			workbench: {
				nav: [],
				account: [],
				admin: [],
				project: []
			}
		};

		result.workbench.nav = sort(nav, nav.order);
		result.workbench.account = sort(account, account.order).map(({id, pluginId, component, label}) => {
			const path = `/${pluginId}/${id}`;
			result.routes.account.push({ path, component });
			
			return { label, path};
		});
		result.workbench.admin = sort(admin, admin.order).map(({id, pluginId, component, label}) => {
			const path = `/${pluginId}/${id}`;
			result.routes.admin.push({ path, component });
			
			return { label, path};
		});
		result.workbench.project = sort(project, project.order).map(({id, pluginId, component, label}) => {
			const path = `/${pluginId}/${id}`;
			result.routes.project.push({ path, component });
			
			return { label, path};
		});


		store.compiled = true;

		return result;
	}
};