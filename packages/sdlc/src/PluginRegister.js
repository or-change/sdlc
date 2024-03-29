'use strict';

const { Validator } = require('@or-change/duck');
const mountPoints = [
	'Account', 'Principal', 'Project', '$project', 'Flow',
	'$flow', 'Trace', '$trace', 'Member', '$member',
	'Version', '$version', 'Admin', 'Plugin'
];

function normalize(options) {
	Validator({
		type: 'array',
		items: {
			type: 'object',
			// additionalProperties: false,
			properties: {
				id: {
					type: 'string'
				},
				name: {
					type: 'string'
				},
				description: {
					type: 'string'
				},
				entry: {
					type: 'string'
				},
				routers: {
					type: 'object'
				},
				install: {
					instanceof: 'Function'
				}
			}
		}
	})(options);

	return options.map(option => {
		const finalOptions = {
			routers: {},
			install: () => {}
		};

		const {
			id: _id,
			name: _name,
			description: _description,
			entry: _entry,
			routers: _routers = finalOptions.routers,
			install: _install = finalOptions.install
		} = option;

		finalOptions.id = _id;
		finalOptions.name = _name;
		finalOptions.description = _description;
		finalOptions.entry = _entry;
		finalOptions.routers = _routers;
		finalOptions.install = _install;

		return finalOptions;
	});
}

function validate(plugins) {
	const pluginStore = [];

	plugins.forEach(plugin => {
		const { id, routers } = plugin;

		if (pluginStore.indexOf(id) !== -1) {
			throw new Error('The id of plugin is EXISTED.');
		}

		pluginStore.push(id);

		Object.keys(routers).forEach(mountPoint => {
			if (mountPoint.indexOf(mountPoint) === -1) {
				throw new Error(`The '${mountPoint}' mountPoint of router is NOT existed.`);
			}
		});
	});
}

module.exports = function (plugins) {
	const store = {
		routers: {}
	};

	mountPoints.forEach(mountPoint => store.routers[mountPoint] = []);

	const finalPlugins = normalize(plugins);

	validate(finalPlugins);

	finalPlugins.forEach(({ routers }) => {
		for (let mountPoint in routers) {
			store.routers[mountPoint].push(routers[mountPoint]);
		}
	});

	return {
		RouterMounter(injection) {
			const { KoaRouter } = injection;

			return function mountRouter(mountName, router, path) {
				store.routers[mountName].forEach(Router => {
					const childRouter = new KoaRouter();

					Router(childRouter, injection);
					router.use(path ? path : '', childRouter.routes());
				});
			};
		},
		inject(injection) {
			finalPlugins.forEach(({ install }) => install(injection));
		},
		get entrys() {
			const webpackEntrys = [];

			finalPlugins.forEach(({ entry }) => {
				if (entry) {
					webpackEntrys.push(entry);
				}
			});

			return webpackEntrys;
		},
		get plugins() {
			return finalPlugins.map(({ id, name, description }) => {
				return { id, name, description };
			});
		}
	};
};