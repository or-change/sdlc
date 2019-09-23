export function routerNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected for extend router.');
	}

	return options;
}

function navItemnormalize(options) {
	if (typeof options !== 'object') {
		throw new Error('Object is Expected for extend.');
	}

	const { path, label, id } = options;

	if (typeof label !== 'string') {
		throw new Error('options.label should be an string.');
	}

	if (typeof path !== 'string' ) {
		throw new Error('options.path should be a string.');
	}

	if (typeof id !== 'string' ) {
		throw new Error('options.id should be a string.');
	}
}

export function i18nNormalize(options) {
	if (typeof options !== 'object') {
		throw new Error('Object is Expected for extend.');
	}

	Object.keys(options).forEach(key => {
		if (Array.isArray(options[key])) {
			throw new Error(`options.${key} should be an Array.`);
		}
	});

	return options;
}

export function navNormalize(options) {
	navItemnormalize(options);

	const { id, path, label, items } = options;

	if (path) {
		return {
			id, path, label,
		};
	}

	if (!Array.isArray(items)) {
		throw new Error('options.items should be an array.');
	}

	const subNav = items.map(item => {
		navItemnormalize(item);

		const { path, label } = item;

		return {
			path, label
		};
	});

	return {
		id, label, items: subNav
	};
}

function normalize(options) {
	if (typeof options !== 'object') {
		throw new Error('Object is Expected for extend.');
	}

	const { id, label } = options;

	if (typeof label !== 'string') {
		throw new Error('options.label should be an string.');
	}

	if (typeof id !== 'string' ) {
		throw new Error('options.id should be a string.');
	}
}

export function itemNormalize(options) {
	normalize(options);

	const { id, component, label, items } = options;

	if (component) {
		return {
			id, component, label
		};
	}

	const subItems = items.map(item => {
		normalize(item);

		const { id, component, label } = item;

		return {
			id, component, label
		};
	});

	return {
		id, label, items: subItems
	};
}

export function topicNormalize(options) {
	normalize(options);

	const { id, component, label, extend, target, items, ownerOnly = false } = options;

	if (extend && typeof extend !== 'function') {
		throw new Error('options.extend should be a function.');
	}

	if (target) {
		if (typeof target !== 'object') {
			throw new Error('options.target should be a function.');
		}

		const { id, pluginId, install } = target;

		if (typeof id !== 'string') {
			throw new Error('options.target.id should be a string.');
		}

		if (typeof pluginId !== 'string') {
			throw new Error('options.target.pluginId should be a string.');
		}

		if (typeof install !== 'function') {
			throw new Error('options.target.install should be a function.');
		}
	}

	if (component) {
		return {
			id, component, label, extend, target, ownerOnly
		};
	}

	const subItems = items.map(item => {
		normalize(item);

		const { id, component, label } = item;

		return {
			id, component, label
		};
	});

	return {
		id, label, extend, target,
		items: subItems, ownerOnly
	};
}

export function orderNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected for order.');
	}

	return options;
}