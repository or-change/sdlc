'use strict';

const Duck = require('@or-change/duck');
const meta = require('./package.json');

const Webpack = require('./src/webpack');
const Register = require('./src/Register');
const Application = require('./src/Application');
const models = [
	require('./src/models/Account'),
	require('./src/models/Project'),
	require('./src/models/Flow'),
	require('./src/models/Trace'),
	require('./src/models/Version')
];

module.exports = function SDLC(options) {
	const sdlc = {};

	Duck({
		id: 'com.orchange.sdlc',
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		injection: {
			pluginManager: Register(options.plugins),
			authenticate: options.server.authenticate,
		},
		components: [
			Duck.Web([
				{
					id: 'Default',
					Application
				}
			]),
			Duck.Datahub([
				{
					id: 'com.orchange.sdlc',
					models: models.reduce((all, group) => Object.assign(all, group), {})
				}
			]),
			Duck.Webpack({
				sdlc: Webpack
			})
		],
		installed({ Datahub, injection }) {
			injection.Model = Datahub('com.orchange.sdlc', options.persistence).model;
		}
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Server('app', 'http', Web.Application.Default()); //https可以加
		sdlc.webpack = Webpack('sdlc');
	});

	return sdlc;
};