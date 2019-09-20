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
				{ path: '/overview', label: { sub: '概览' } },
				{ path: '/project', label: { sub: '我的项目' } }
			]
		},
		account: {
			order: [],
			items: [
				{ path: '/profile', label: { sub: '用户信息' } }
			]
		},
		admin: {
			order: [],
			items: []
		},
		project: {
			order: [],
			topics: [
				{ path: '/property', label: { sub: '项目属性' } },
				{ path: '/member', label: { sub: '项目成员' } },
				{ path: '/version', label: { sub: '版本信息' } },
				{ path: '/track', label: { sub: '阶段追踪' } },
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
			path, label: label.main ? label.main : label.sub
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
				return { path: path, label: label.main ? label.main : label.sub };
			}),
			account: accountOptions.options,
			admin: adminOptions.options,
			project: projectOptions.options
		}
	};
}