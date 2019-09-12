'use strict';

const store = {
	pluginList: [],
	routeList: [],
	webpackEntryList: []
};

const register = {
	get pluginList() {
		return store.pluginList.slice(0);
	},
	get routeList() {
		return store.routeList.slice(0);
	},
	get webpackEntryList() {
		return store.webpackEntryList.slice(0);
	}
};

module.exports = function (plugins, injectionExtention) {
	plugins.forEach(plugin => {
		const {
			id, name, description,
			routes = {}, entry = [], install
		} = plugin;

		
		store.pluginList.push({
			id, name, description
		});
		store.routeList.push(routes);
		store.webpackEntryList.push(...entry);

		if (install) {
			install(injectionExtention);
		}
	});

	return register;
};