'use strict';
// normalize
module.exports = function (plugins) {
	const store = {
		routers: {
			'Account': [],
			'Principal': [],
			'Project': [],
			'$project': [],
			'Flow': [],
			'$flow': [],
			'Trace': [],
			'$trace': [],
			'Member': [],
			'$member': [],
			'Version': [],
			'$version': [],
			'Admin': [],
			'Plugin': []
		}
	};

	function validate(plugins) {
		const pluginStore = [];

		plugins.forEach(plugin => {
			const { id, routers} = plugin;

			if (pluginStore.indexOf(id) !== -1) {
				throw new Error('The id of plugin is EXISTED.');
			}

			pluginStore.push(id);

			Object.keys(routers).forEach(mountPoint => {
				if (!store.routers[mountPoint]) {
					throw new Error(`The '${mountPoint}' mountPoint of router is NOT existed.`);
				}
			});
		});
	}

	validate(plugins);

	plugins.forEach(plugin => {
		const {
			routers = {}
		} = plugin;

		for (let mountPoint in routers) {
			store.routers[mountPoint].push(routers[mountPoint]);
		}
	});

	return function PluginAccessor() {
		return {
			RouterMounter(context, injection) {
				const { KoaRouter } = context;

				return function mountRouter(mountName, router, path) {
					store.routers[mountName].forEach(Router => {
						const childRouter = new KoaRouter();

						Router(childRouter, context, injection);
						router.use(path ? path : '', childRouter.routes());
					});
				};
			},
			inject(injection) {
				plugins.forEach(({ install = () => {} }) => install(injection));
			},
			get entrys() {
				const webpackEntrys = [];
				plugins.forEach(({ entry = '' }) => webpackEntrys.push(entry));

				return webpackEntrys;
			},
			get plugins() {
				return plugins.map(({ id, name, description }) => {
					return { id, name, description };
				});
			}
		};
	};
};