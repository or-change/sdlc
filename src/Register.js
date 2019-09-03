'use strict';

module.exports = function (plugins) {
	const store = {
		pluginList: [],
		routeList: []
	};
	
	const register = {
		route(route) {
			store.routeList.push(route);
		},
		get pluginList() {
			return store.pluginList.slice(0);
		},
		get routeList() {
			return store.routeList.slice(0);
		}
	};

	plugins.forEach(plugin => {
		const { id, name, description, install } = plugin;
	
		store.pluginList.push({
			id, name, description
		});

		install(register);
	});

	return register;
};