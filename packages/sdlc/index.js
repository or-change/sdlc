

const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckDatahub = require('@or-change/duck-datahub');
const DuckWebpack = require('@or-change/duck-webpack');
const DuckLog  = require('@or-change/duck-log');

const Webpack = require('./src/webpack');
const Application = require('./src/Application');
const models = require('./src/models');
const PluginRegister = require('./src/PluginRegister');

const APP_ID = 'com.orchange.sdlc';
const meta = require('./package.json');

module.exports = function SDLC(options) {
	const sdlc = {};
	const PluginAccessor = PluginRegister(options.plugins);

	Duck({
		id: APP_ID,
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		injection: {
			authenticate: options.server.authenticate,
			Plugin: PluginAccessor()
		},
		components: [
			DuckWeb([
				{
					id: 'Default',
					Application: Application({
						session: options.server.session
					})
				}
			]),
			DuckDatahub([
				{
					id: APP_ID,
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			DuckWebpack({
				sdlc: Webpack
			}),
			DuckLog()
		],
		installed({ Datahub, injection, Logger }) {
			injection.ServiceLogger =  Logger({
				format(meta, message) {
					return `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${message.type}${JSON.stringify(message.info)}`;
				}
			});
			injection.ExceptionLogger = Logger({
				appenders: [
					DuckLog.Appender.File({
						file: {
							size: 128 * 1024 * 1024
						}
					})
				]
			});
			injection.Model = Datahub(APP_ID, options.store).model;
			injection.Plugin.inject(injection);
			options.server.installed(injection);
		}
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Http.createServer(Web.Application('Default'));
		sdlc.webpack = Webpack('sdlc', { app: options.app });
	});

	return sdlc;
};