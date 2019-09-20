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

	order.forEach(id => {
		const item = items.find(item => item.id === id);

		result.push(item);
	});

	return result;
}

export function generateResult() {
	const {
		routes: workbenchRoutes, nav, account, admin, project
	} = store.workbench;
	const {
		routes: globalRoutes, AuthenticationPage, Footer, home
	} = store.global;

	const result = {
		routes: {
			global: globalRoutes,
			workbench: workbenchRoutes,
			account: [],
			admin: [],
			project: []
		},
		AuthenticationPage: AuthenticationPage,
		Footer: Footer,
		home: home,
		workbench: {
			nav: [],
			account: [],
			admin: [],
			project: []
		}
	};

	return result;
}