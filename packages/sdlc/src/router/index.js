'use strict';

const Router = {
	Base: require('./Base'),
	Principal: require('./Principal'),
	Account: require('./Account'),
	Project: require('./Project'),
	Version: require('./Version'),
	Member: require('./Member'), 
	Flow: require('./Flow'),
	Trace: require('./Trace'),
	Admin: require('./Admin')
};

const mountPoint = {
	account: [],
	project: [],
	version: [],
	admin: [],
	plugin: []
};

module.exports = function (routes) {
	routes.forEach(route => {
		for (let key in route) {
			mountPoint[key].push({
				Router: route[key]
			});
		}
	});

	return {
		prefix: '/api',
		Router: Router.Base,
		use: [
			{
				prefix: '/account',
				Router: Router.Account,
				use: mountPoint.account
			},
			{
				prefix: '/principal',
				Router: Router.Principal
			},
			{
				prefix: '/project',
				Router: Router.Project,
				use: [
					{
						mount: '/:projectId',
						prefix: '/version',
						Router: Router.Version,
						use: mountPoint.version
					},
					{
						mount: '/:projectId',
						prefix: '/member',
						Router: Router.Member
					},
					{
						mount: '/:projectId',
						prefix: '/flow',
						Router: Router.Flow,
					},
					{
						mount: '/:projectId',
						prefix: '/trace',
						Router: Router.Trace
					}
				].concat(mountPoint.project)
			},
			{
				prefix: '/admin',
				Router: Router.Admin,
				use: mountPoint.admin
			},
			{
				prefix: '/plugin',
				Router(route, ctx, injection) {
					mountPoint.plugin.forEach(({ Router }) => Router(route, ctx, injection));
				}
			}
		]
	};
};