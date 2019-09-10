'use strict';

const Duck = require('@or-change/duck');
const DuckWeb = require('@or-change/duck-web');
const DuckDatahub = require('@or-change/duck-datahub');
const DuckWebpack = require('@or-change/duck-webpack');

const Webpack = require('./src/webpack');
const Application = require('./src/Application');
const models = require('./src/models');
const Register = require('./src/Register');

const SDLC_HASH = 'com.orchange.sdlc';
const meta = require('./package.json');

module.exports = function SDLC(options) {
	const sdlc = {};

	Duck({
		id: SDLC_HASH,
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
					Application
				}
			]),
			DuckDatahub([
				{
					id: SDLC_HASH,
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			DuckWebpack({
				sdlc: Webpack
			})
		],
		installed({ Datahub, injection }) {
			injection.Model = Datahub(SDLC_HASH, options.store).model;
			injection.pluginManager = Register(options.plugins, injection);
		}
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Http.createServer(Web.Application('Default'));
		sdlc.webpack = Webpack('sdlc');
	});

	return sdlc;
};