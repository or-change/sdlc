'use strict';

const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');
const DuckKoaAcl = require('@or-change/duck-web-koa-acl');
const DuckWebKoaSession = require('@or-change/duck-web-koa-session');

const koaBody = require('koa-body');

const Router = {
	Base: require('./router/Base'),
	Principal: require('./router/Principal'),
	Account: require('./router/Account'),
	Project: require('./router/Project'),
	Version: require('./router/Version'),
	Member: require('./router/Member'),
	Flow: require('./router/Flow'),
	Trace: require('./router/Trace'),
	Admin: require('./router/Admin')
};
const AccessControl = require('./AccessControl');

module.exports = DuckWebKoa((app, { AppRouter, Session }) => {
	app.use(koaBody({
		multipart: true
	}));

	Session(app);

	app.use(AppRouter().routes());
}, [
	DuckWebKoaRouter({
		prefix: '/api',
		Router: Router.Base,
		use: [
			{
				prefix: '/account',
				Router: Router.Account
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
				Router(router, context, { pluginManager, Model }) {
					pluginManager.routeList.forEach(install => install(router, Model));
				}
			}
		],
	}),
	DuckKoaAcl(AccessControl),
	DuckWebKoaSession()
]);