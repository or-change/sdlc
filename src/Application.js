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
							use: [
								{
									prefix: '/version',
									Router: Router.Version
								},
								{
									prefix: '/flow',
									Router: Router.Flow,
									use: [
										{
											mount: '/:flowId',
											prefix: '/trace',
											Router: Router.Trace
										}
									]
								},
								{
									prefix: '/member',
									Router: Router.Member
								}
							]
						}
					]
				},
				{
					prefix: '/admin',
					Router: Router.Admin
				},
				{
					prefix: '/plugin',
					Router(router, { pluginManager, datahubs }) {
						pluginManager.routeList.forEach(install => install(router, datahubs.sdlc));
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