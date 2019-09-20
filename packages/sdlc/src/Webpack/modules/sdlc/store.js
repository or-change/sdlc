export const store = window.store = {
	installed: false,
	compiled: false,
	plugins: {},
	global: {
		AuthenticationPage: null,
		Footer: null,
		home: '/',
		routes: []
	},
	workbench: {
		routes: [],
		nav: {
			order: [],
			items: [
				{ path: 'overview', label: { main:'desktop.overview', sub: '概览' } },
				{ path: 'project', label: { main:'desktop.project', sub: '我的项目' } }
			]
		},
		account: {
			order: [],
			items: [
				{ path: 'profile', label: { main: 'account.profile', sub: '用户信息' } }
			]
		},
		admin: {
			order: [],
			items: []
		},
		project: {
			order: [],
			topics: [
				{ path: 'property', label: { main: 'project.property', sub: '项目属性' } },
				{ path: 'member', label: { main: 'project.member', sub: '项目成员' } },
				{ path: 'version', label: { main: 'project.version', sub: '版本信息' } },
				{ path: 'track', label: { main: 'project.track', sub: '阶段追踪' } },
			],
			installers: []
		}
	}
};

function sort(items, order) {
	const result = [];
	const unOrder = [];

	items.forEach((item, index) => {
		const position = order.indexOf(index);

		if (position !== -1) {
			result[position] = item;
		} else {
			unOrder.push(item);
		}
	});

	return result.concat(unOrder);
}

function compile(items) {
	const routes = [];
	const options = [];

	items.forEach(item => {
		const { path, component, label } = item;

		if (component) {
			routes.push({
				path, component
			});
		}

		options.push({
			path, label
		});
	});

	return { routes, options };
}

export function generateResult() {
	const {
		routes: workbenchRoutes, nav, account, admin, project
	} = store.workbench;
	const {
		routes: globalRoutes, AuthenticationPage, Footer, home
	} = store.global;

	const accountOptions = compile(sort(account.items, account.order));
	const adminOptions = compile(sort(admin.items, admin.order));
	const projectOptions = compile(sort(project.topics, project.order));

	return {
		routes: {
			global: globalRoutes,
			workbench: workbenchRoutes,
			account: accountOptions.routes,
			admin: adminOptions.routes,
			project: projectOptions.routes
		},
		AuthenticationPage: AuthenticationPage,
		Footer: Footer,
		home: home,
		workbench: {
			nav: sort(nav.items, nav.order).map(({ path, label }) => {
				return { path: path, label };
			}),
			account: accountOptions.options,
			admin: adminOptions.options,
			project: projectOptions.options
		}
	};
}