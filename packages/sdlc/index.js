'use strict';

const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckDatahub = require('@or-change/duck-datahub');
const DuckWebpack = require('@or-change/duck-webpack');
const DuckLog  = require('@or-change/duck-log');

const Webpack = require('./src/webpack');
const Application = require('./src/Application');
const LoggerFactory = require('./src/Logger');
const models = require('./src/models');
const PluginRegister = require('./src/PluginRegister');

const APP_ID = 'com.orchange.sdlc';
const meta = require('./package.json');
const normalize = require('./src/normalize');

module.exports = function SDLC(options) {
	const sdlc = {};
	const finalOptions = normalize(options);
	const PluginAccessor = PluginRegister(finalOptions.plugins);

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
					Application: Application({
						session: finalOptions.server.session
					})
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
		installed({ Datahub, injection }) {
			const Logger = LoggerFactory(injection);
			const { access, model, authentication, exception } = finalOptions.server.log;

			[
				{ type: 'AccessLog', options: access }, { type: 'ModelLog', options: model },
				{ type: 'AuthenticationLog', options: authentication }, { type: 'ExceptionLogger', options: exception }
			].forEach(({ type, options }) => {
				injection[type] = Logger(type, options);
			});

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