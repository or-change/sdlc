'use strict';

const Duck = require('@or-change/duck');
const koaBody = require('koa-body');

const Router = {
	Base: require('./router/Base'),
	Account: require('./router/Account'),
	Project: require('./router/Project'),
	Version: require('./router/Version'),
	Member: require('./router/Member'),
	Flow: require('./router/Flow'),
	Trace: require('./router/Trace'),
	Admin: require('./router/Admin')
};
const AccessControl = require('./AccessControl');

module.exports = Duck.Web.Koa({
	plugins: [
		Duck.Web.Koa.KoaRouter({
			prefix: '/api',
			Router: Router.Base,
			use: [
				{
					prefix: '/account',
					Router: Router.Account
				},
				{
					prefix: '/project',
					Router: Router.Project,
					use: [
						{
							mount: '/:projectId',
							prefix: '/version',
							Router: Router.Version
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
					]
				},
				{
					prefix: '/admin',
					Router: Router.Admin
				},
				{
					prefix: '/plugin',
					Router(router, { pluginManager, Model }) {
						pluginManager.routeList.forEach(install => install(router, Model));
					}
				}
			],
		}),
		Duck.Web.Koa.AccessControl(AccessControl),
		Duck.Web.Koa.Session()
	],
	factory(app, injection, { AppRouter, Session }) {
		app.use(koaBody());
		Session(app);

		const router = AppRouter();
		app.use(router.routes()).use(router.allowedMethods());
	}
});