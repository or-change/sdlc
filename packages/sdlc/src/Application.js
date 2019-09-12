'use strict';

const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaSession = require('@or-change/duck-web-koa-session');
const DuckKoaAcl = require('@or-change/duck-web-koa-acl');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');

const AccessControl = require('./AccessControl');
const Router = require('./router');

const koaBody = require('koa-body');

module.exports = function ({ session, routes }) {
	return DuckWebKoa((app, { AppRouter, Session }) => {
		app.use(koaBody({
			multipart: true
		}));
	
		Session(app);
	
		app.use(AppRouter().routes());
	}, [
		DuckWebKoaRouter(Router(routes)),
		DuckKoaAcl(AccessControl),
		DuckWebKoaSession(session)
	]);
};