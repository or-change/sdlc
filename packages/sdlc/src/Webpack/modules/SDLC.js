import axios from 'axios';
import SDLCProductFactory from 'sdlc-product-factory';

const store = window.store = {
	installed: false,
	compiled: false,
	state: {},
	plugins: {},
	extenders: {},
	installers: [],
	decorators: {},
	home: '/',
	authentication: '/signin',
	routes: [],
	i18n: {
		zh: [],
		en: []
	}
};

const DEFAULT_PLUGINID = [
	'oc.com.sdlc.core.workbench'
];

function PluginExtender() {
	return {
		appendRoutes(newRoutes) {
			if (!Array.isArray(newRoutes)) {
				throw new Error('Array is Expected for extend router.');
			}
		
			store.routes = store.routes.concat(newRoutes);
		
			return this;
		},
		appendI18n(options) {
			Object.keys(options).forEach(key => {
				store.i18n[key] = store.i18n[key] ?
					store.i18n[key].concat(options[key]) : [options[key]];
			});

			return this;
		},
		appendState(name, options) {
			if (typeof name !== 'string') {
				throw new Error('String is Expected.');
			}

			store.state.name = options;
		}
	};
}

function Decorator() {
	return {
		setAuthentication(routerPath) {
			if (typeof routerPath !== 'string') {
				throw new Error('String is Expected.');
			}

			store.authentication = routerPath;
		
			return this;
		},
		setHome(routerPath) {
			if (typeof routerPath !== 'string') {
				throw new Error('String is Expected.');
			}

			store.home = routerPath;
		
			return this;
		},
		pluginExtender: PluginExtender()
	};
}

function normalize(options) {
	const { Plugin, extender, installer, decorator } = options;

	if (Plugin && typeof Plugin !== 'function') {
		throw new Error('Plugin must be a Function.');
	}

	if (extender && typeof extender !== 'function') {
		throw new Error('extender must be a Function.');
	}

	if (installer) {

		if (typeof installer !== 'object') {
			throw new Error('installer must be a Function.');
		}

		if (!installer.id) {
			throw new Error('installer.id is need.');
		}

		if (typeof installer.install !== 'function') {
			throw new Error('installer.install must be a Function.');
		}
	}

	if (decorator && typeof decorator !== 'object') {
		throw new Error('decorator must be a object.');
	}

	return {
		Plugin, extender, installer, decorator
	};
}

export default {
	install(id, options) {
		if (store.installed) {
			throw new Error('Can NOT install after installed.');
		}
		//installer Array??
		const { Plugin, extender, installer, decorator } = normalize(options);

		store.plugins[id] = Plugin;

		if (extender) {
			store.extenders[id] = extender;
		}

		if (installer) {
			store.installers.push(installer);
		}

		if (decorator) {
			store.decorators[id] = decorator;
		}
	},
	async compile() {
		if (store.compiled) {
			throw new Error('Duplicated compiling is NOT be allowed.');
		}
		
		store.installed = true;
		store.compiled = true;

		const { data } = await axios.get('/api/product');
		const plugins = data.plugins.map(plugin => plugin.id).concat(DEFAULT_PLUGINID);

		Object.keys(store.plugins).forEach(pluginId => {
			if (plugins.indexOf(pluginId) === -1) {
				throw new Error(`plugin ${pluginId} is not registered.`);
			}

			store.plugins[pluginId](PluginExtender(pluginId));
		});

		store.installers.forEach(installer => {
			const { id, install } = installer;
			const extender = store.extenders[id];

			if (extender) {
				install(extender());
			}
		});

		SDLCProductFactory({
			sdlc: Decorator(),
			plugins: store.decorators
		});

		return {
			state: store.state,
			home: store.home,
			authentication: store.authentication,
			routes: store.routes,
			i18n: store.i18n
		};
	}
};