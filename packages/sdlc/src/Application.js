'use strict';

const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaSession = require('@or-change/duck-web-koa-session');
const DuckKoaAcl = require('@or-change/duck-web-koa-acl');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');
const DuckWebKoaValidator = require('@or-change/duck-web-koa-validator');

const AccessControl = require('./AccessControl');
const router = require('./router');

const koaBody = require('koa-body');

module.exports = function ({ session }) {
	return DuckWebKoa((app, { AppRouter, Session }, { ExceptionLogger }) => {
		app.use(koaBody({
			multipart: true
		}));
	
		Session(app);

		app.use(async (ctx, next) => {
			try {
				await next();
			} catch (error) {
				ExceptionLogger.error(error);
				ctx.res.end();
			}
		});
	
		app.use(AppRouter().routes());
	}, {
		plugins: [
			DuckWebKoaRouter(router),
			DuckKoaAcl(AccessControl),
			DuckWebKoaSession(session),
			DuckWebKoaValidator()
		],
		installed(context, { Plugin, injection }) {
			context.mountRouter = Plugin.RouterMounter(context, injection);
		}
	});
};