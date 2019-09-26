export function itemNormalize(options) {
	const { id, path, label, icon, badge } = options;

	if (!id) {
		throw new Error('options.id is need.');
	}

	if (typeof path !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	if (typeof label !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	if (icon && typeof icon !== 'string') {
		throw new Error('options.icon is Expected be a string.');
	}

	if (badge && typeof badge !== 'string') {
		throw new Error('options.badge is Expected be a string.');
	}

	return {
		id, path, label, icon, badge
	};
}

export function orderNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected to order.');
	}

	return options;
}

export function routerNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected for extend router.');
	}

	return options;
}