'use strict';

const Duck = require('@or-change/duck');
const meta = require('./package.json');

const webpack = require('./src/webpack');
const app = require('./src/application');

module.exports = function SDLC(options) {
	const sdlc = {};

	Duck({
		id: 'com.orchange.sdlc',
		name: 'sdlc',
		version: meta.version,
		description: meta.description,
		components: [
			Duck.Web([
				{
					id: 'default',
					Application: app
				}
			]),
			Duck.Datahub([
				{
					id: options.data.id,
					alias: 'sdlc',
					models: {

					}
				}
			]),
			Duck.Webpack({
				sdlc: webpack
			})
		]
	}, ({ Web, Webpack }) => {
		sdlc.server = Web.Server('app', 'http', Web.Application.default()); //https
		sdlc.webpack = Webpack('sdlc');
	});

	return sdlc;
};