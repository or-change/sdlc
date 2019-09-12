'use strict';

const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckDatahub = require('@or-change/duck-datahub');
const DuckWebpack = require('@or-change/duck-webpack');

const Webpack = require('./src/webpack');
const Application = require('./src/Application');
const models = require('./src/models');
const Register = require('./src/Register');

const APPID = 'com.orchange.sdlc';
const meta = require('./package.json');

module.exports = function SDLC(options) {
	const sdlc = {};
	
	const pluginInjection = Duck.Injection();
	const pluginManager = Register(options.plugins, pluginInjection);

	Duck({
		id: APPID,
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		injection: {
			authenticate: options.server.authenticate,
		},
		components: [
			DuckWeb([
				{
					id: 'Default',
					Application: Application({
						session: options.server.session,
						routes: pluginManager.routeList
					})
				}
			]),
			DuckDatahub([
				{
					id: APPID,
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			DuckWebpack({
				sdlc: Webpack
			})
		],
		installed({ Datahub, injection }) {
			injection.Model = Datahub(APPID, options.store).model;
			injection.pluginManager = pluginManager;

			options.server.installed(injection, pluginInjection);
		}
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Http.createServer(Web.Application('Default'));
		sdlc.webpack = Webpack('sdlc');
	});

	return sdlc;
};