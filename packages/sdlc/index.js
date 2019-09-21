'use strict';

const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckDatahub = require('@or-change/duck-datahub');
const DuckWebpack = require('@or-change/duck-webpack');
const DuckLog  = require('@or-change/duck-log');
const DuckWebKoa = require('@or-change/duck-web-koa');
const DuckWebKoaSession = require('@or-change/duck-web-koa-session');
const DuckKoaAcl = require('@or-change/duck-web-koa-acl');
const DuckWebKoaRouter = require('@or-change/duck-web-koa-router');
const DuckWebKoaValidator = require('@or-change/duck-web-koa-validator');
const koaBody = require('koa-body');

const AccessControl = require('./src/AccessControl');
const router = require('./src/router');
const Webpack = require('./src/webpack');
const models = require('./src/models');
const PluginRegister = require('./src/PluginRegister');

const meta = require('./package.json');
const normalize = require('./src/normalize');

const APP_ID = 'com.orchange.sdlc';

module.exports = function SDLC(options) {
	const sdlc = {};
	const finalOptions = normalize(options);
	const PluginAccessor = PluginRegister(finalOptions.plugins);
	const SDLCApplicationBackend = DuckWebKoa((app, { AppRouter, Session }, { Log }) => {
		app.use(async (ctx, next) => {
			try {
				await next();
				Log.access.info('');
			} catch (error) {
				Log.access.error('');
			}
		});

		app.use(koaBody({ multipart: true }));
		Session(app);
		app.use(AppRouter().routes());
	}, {
		plugins: [
			DuckWebKoaRouter(router),
			DuckKoaAcl(AccessControl),
			DuckWebKoaSession(finalOptions.server.session),
			DuckWebKoaValidator()
		],
		installed(context, { Plugin, injection }) {
			context.mountRouter = Plugin.RouterMounter(context, injection);
		}
	});

	Duck({
		id: APP_ID,
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		injection: {
			authenticate: finalOptions.server.authenticate,
			Plugin: PluginAccessor()
		},
		components: [
			DuckWeb([
				{
					id: 'Default',
					Application: SDLCApplicationBackend
				}
			]),
			DuckDatahub([
				{
					id: APP_ID,
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			DuckWebpack({ sdlc: Webpack }),
			DuckLog()
		],
		installed({ Datahub, injection, Logger }) {
			// const Logger = LoggerFactory(injection);
			// const { access, model, authentication } = finalOptions.server.log;

			// [
			// 	{ type: 'AccessLog', options: access },
			// 	{ type: 'ModelLog', options: model },
			// 	{ type: 'AuthenticationLog', options: authentication },
			// ].forEach(({ type, options }) => {
			// 	injection[type] = Logger(type, options);
			// });

			injection.Log = {
				access: Logger({
					format() {

					}
				}),
				model: Logger({

				}),
				authenticate: Logger({

				})
			};
			injection.Model = Datahub(APP_ID, finalOptions.store).model;
			injection.Plugin.inject(injection);

			finalOptions.server.installed(injection);
		}
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Http.createServer(Web.Application('Default'));
		sdlc.webpack = Webpack('sdlc', { app: finalOptions.app });
	});

	return sdlc;
};