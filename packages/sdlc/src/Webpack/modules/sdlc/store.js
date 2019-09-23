export const store = window.store = {
	installed: false,
	compiled: false,
	plugins: {},
	global: {
		AuthenticationPage: null,
		Footer: null,
		home: '/',
		routes: [],
		i18n: {
			zh: [],
			en: []
		}
	},
	workbench: {
		routes: [],
		nav: {
			order: [],
			items: []
		},
		account: {
			order: [],
			items: []
		},
		admin: {
			order: [],
			items: []
		},
		project: {
			order: [],
			topics: [],
			installers: []
		}
	}
};

function sort(allItems, order) {
	const result = [];
	const complete = [];

	order.forEach(orderItem => {
		const { id, items = [] } = orderItem;
		const orderedItem = allItems.find(item => item.id === id);

		const existedItem = { id: orderedItem.id };

		if (orderedItem.items) {
			const subOrder = [].concat(items);

			orderedItem.items.forEach(subItem => {
				const existedItem = subOrder.find(id => subItem.id === id);
			
				if (!existedItem) {
					subOrder.push(subItem.id);
				}
			});

			existedItem.items = subOrder;
		}

		complete.push(existedItem);
	});

	allItems.forEach(item => {
		const orderedItem = order.find(orderItem => orderItem.id === item.id);

		if (!orderedItem) {
			const newOrder = { id: item.id };
			
			if (item.items) {
				newOrder.items = item.items.map(item => item.id);
			}

			complete.push(newOrder);
		}
	});

	complete.forEach(orderItem => {
		const { id, items } = orderItem;
		const targetItem = allItems.find(item => item.id === id);

		if (items) {
			const subItems = [];

			items.forEach(subItemId => {
				const targetSubItem = targetItem.items.find(item => item.id === subItemId);

				subItems.push(targetSubItem);
			});

			targetItem.items = subItems;
		}

		result.push(targetItem);
	});

	return result;
}

function compile(allItems) {
	const routes = [];
	const options = [];

	allItems.forEach(item => {
		const { id, pluginId, component, label, items } = item;

		if (component) {
			const path = `${pluginId}/${id}`;

			routes.push({
				path, component
			});

			options.push({
				path, label
			});

			return;
		}

		const subItems = items.forEach(item => {
			const { id, component, label } = item;
			const path = `${pluginId}/${id}`;

			routes.push({
				path, component
			});

			return {
				path, label
			};
		});

		options.push({
			label, items: subItems
		});
	});

	return { routes, options };
}

export function generateResult() {
	const {
		routes: workbenchRoutes, nav, account, admin, project
	} = store.workbench;
	const {
		routes: globalRoutes, AuthenticationPage, Footer, home, i18n
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
		i18n,
		workbench: {
			nav: sort(nav.items, nav.order),
			account: accountOptions.options,
			admin: adminOptions.options,
			project: projectOptions.options
		}
	};
}