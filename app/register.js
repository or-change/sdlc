export const store = {
	routerOptions: [],
	plugins: {}
};

const register = {
	router(options) {
		store.routerOptions.push(options);
	},
	plugins(key, {
		component
	}) {
		store.source[key] = {
			component
		};
	}
};

window.product = {
	use(installer) {
		installer(register);
	}
};