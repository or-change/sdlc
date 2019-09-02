'use strict';

const Duck = require('@or-change/duck');
const koaBody = require('koa-body');

const base = require('./router/base');
const account = require('./router/account');
const project = require('./router/project');
const version = require('./router/version');
const flow = require('./router/flow');
const trace = require('./router/trace');

const authority = require('./authority');

module.exports = Duck.Web.Koa({
	plugins: [
		Duck.Web.Koa.KoaRouter({
			prefix: '/api',
			Router: base,
			use: [
				{
					prefix: '/account',
					Router: account
				},
				{
					prefix: '/project',
					Router: project,
					use: [
						{
							prefix: '/:projectId/version',
							Router: version
						},
						{
							prefix: '/:projectId/flow',
							Router: flow,
							use: [
								{
									prefix: '/:flowId/trace',
									Router: trace
								}
							]
						}
					]
				}
			],
		}),
		Duck.Web.Koa.AccessControl(authority),
		Duck.Web.Koa.Session()
	],
	factory(app, injection, { AppRouter, Session }) {
		app.use(koaBody());
		Session(app);

		const router = AppRouter();
		app.use(router.routes()).use(router.allowedMethods());
	}
});