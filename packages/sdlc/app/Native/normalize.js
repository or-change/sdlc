export function itemNormalize(options) {
	const { id, path, label } = options;

	if (!id) {
		throw new Error('options.id is need.');
	}

	if (typeof path !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	if (typeof label !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	return {
		id, path, label
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

export function topicNormalize(options) {
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

	if (typeof icon !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	if (typeof badge !== 'string') {
		throw new Error('options.path is Expected be a string.');
	}

	return {
		id, path, label, icon, badge
	};
}