'use strict';

module.exports = function () {
	const store = {
		routeList: []
	};

	return {
		route(router) {
			store.routeList.push(router);
		},
		get routeList() {
			return store.routeList.slice(0);
		}
	};
};