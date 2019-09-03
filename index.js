'use strict';

const Duck = require('@or-change/duck');
const meta = require('./package.json');

const Webpack = require('./src/webpack');
const Application = require('./src/Application');
const Model = {
	Account: require('./src/models/Account'),
	Project: require('./src/models/Project'),
	Flow: require('./src/models/Flow'),
	Trace: require('./src/models/Trace'),
	Version: require('./src/models/Version')
};
const Register = require('./src/Register');

module.exports = function SDLC(options) {
	const sdlc = {};

	Duck({
		id: 'com.orchange.sdlc',
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		injection: {
			plugins: {}
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
					id: options.data.id,
					alias: 'sdlc',
					models: Object.assign({}, Model.Account, Model.Project,
						Model.Flow, Model.Trace, Model.Version)
				}
			]),
			Duck.Webpack({
				sdlc: Webpack
			}),
			{
				id: 'com.orchange.sdlc.register',
				name: 'register',
				install(injection) {
					injection.Register = Register();

					options.plugins.forEach(plugin => {
						const {
							id, name, description, install
						} = plugin;

						injection.plugins[id] = { name, description };
						install(injection.Register);
					});
				}
			}
		]
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Server('app', 'http', Web.Application.Default()); //https
		sdlc.webpack = Webpack('sdlc');
	});

	return sdlc;
};