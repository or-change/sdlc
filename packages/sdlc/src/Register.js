'use strict';

module.exports = function (plugins, injection) {
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

	plugins.forEach(plugin => {
		const { id, name, description, install, route, entry } = plugin;
	
		store.pluginList.push({
			id, name, description
		});
		store.routeList.push(route);
		store.webpackEntryList.push(entry); //entry类型？？

		install(injection);
	});

	return register;
};