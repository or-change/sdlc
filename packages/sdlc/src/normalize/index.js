'use strict';

const { Normalizer, Validator } = require('@or-change/duck');
const schema = require('./schema.json');

module.exports = Normalizer(
	{
		handler: options => {
			const finalOptions = {
				plugins: [],
				server: {
					authenticate: () => {},
					installed: () => {}	,
					log: {}
				},
				app: {}
			};

			const {
				plugins: _plugins = finalOptions.plugins,
				server: _server = finalOptions.server,
				app: _app = finalOptions.app,
				store: _store
			} = options;

			const {
				authenticate: _authenticate = finalOptions.server.authenticate,
				installed: _installed = finalOptions.server.installed,
				log: _log = finalOptions.server.log
			} = _server;

			finalOptions.plugins = _plugins;
			finalOptions.server = {
				authenticate: _authenticate,
				installed: _installed,
				log: _log
			};
			finalOptions.store = _store;
			finalOptions.app = _app;


			return finalOptions;
		},
		validate: Validator(schema)
	}
);  