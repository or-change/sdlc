'use strict';

const { Normalizer, Validator } = require('@or-change/duck');
const schema = require('./schema.json');

module.exports = Normalizer(
	{
		handler: options => {
			const finalOptions = {
				namespace: 'sdlc',
				plugins: [],
				server: {
					authenticate: () => {},
					installed: () => {}	,
					events: {}
				},
				app: {}
			};

			const {
				namespace: _namespace = finalOptions.namespace,
				plugins: _plugins = finalOptions.plugins,
				server: _server = finalOptions.server,
				app: _app = finalOptions.app,
				store: _store
			} = options;

			const {
				authenticate: _authenticate = finalOptions.server.authenticate,
				installed: _installed = finalOptions.server.installed,
				events: _events = finalOptions.server.events
			} = _server;

			finalOptions.namespace = _namespace;
			finalOptions.plugins = _plugins;
			finalOptions.server = {
				authenticate: _authenticate,
				installed: _installed,
				events: _events
			};
			finalOptions.store = _store;
			finalOptions.app = _app;


			return finalOptions;
		},
		validate: Validator(schema)
	}
);  