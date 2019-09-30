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
const Channel = require('./src/Channel');
const Logger = require('./src/Logger');

const meta = require('./package.json');
const normalize = require('./src/normalize');

const APP_ID = 'com.orchange.sdlc';
const CHANNEL_NAMES = require('./src/NativeChannelNames.json');

module.exports = function SDLC(options) {
	const sdlc = {};
	const finalOptions = normalize(options);

	const channelCenter = Channel(CHANNEL_NAMES.concat(finalOptions.server.events));
	const pluginAccessor = PluginRegister(finalOptions.plugins);
	const SDLCApplicationBackend = DuckWebKoa((app, { AppRouter, Session }) => {
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
		namespace: finalOptions.namespace,
		description: meta.description,
		injection: {
			authenticate: finalOptions.server.authenticate,
			Plugin: pluginAccessor,
			channelCenter,
			channel: channelCenter(),
			options: {
				get namesapce() {
					return finalOptions.namesapce;
				},
				get store() {
					return Object.assign({}, finalOptions.store);
				}
			}
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
					models: models.concat(pluginAccessor.models).reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			DuckWebpack({ sdlc: Webpack }),
			DuckLog(Logger(finalOptions.server.log))
		],
		installed({ Datahub, injection }) {
			injection.Model = Datahub(APP_ID, finalOptions.store).model;
			injection.Plugin.inject(injection);

			finalOptions.server.installed(injection);
		}
	}, ({ Web, Webpack, Log }) => {
		const application = Web.Application('Default');
		const listener = DuckLog.Adapter.HttpServer(application, abstract => Log.access(abstract));

		sdlc.server = Web.Http.createServer(listener);
		sdlc.webpack = Webpack('sdlc', { app: finalOptions.app });
	});

	return sdlc;
};