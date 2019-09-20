export function routerNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected for extend router.');
	}

	return options;
}

export function itemNormalize(options) {
	if (typeof options !== 'object') {
		throw new Error('Object is Expected for extend.');
	}

	const { path, component, label } = options;

	if (typeof path !== 'string' ) {
		throw new Error('options.path should be a string.');
	}

	if (typeof label !== 'object') {
		throw new Error('options.label should be an object.');
	}

	return {
		path, component,
		label: { main: label.main, sub: label.sub }
	};
}

export function topicNormalize(options) {
	if (typeof options !== 'object') {
		throw new Error('Object is Expected for extend.');
	}

	const { id, path, component, label, extend, target } = options;

	if (typeof id !== 'string') {
		throw new Error('options.id should be a string.');
	}

	if (typeof path !== 'string' ) {
		throw new Error('options.path should be a string.');
	}

	if (typeof label !== 'object') {
		throw new Error('options.label should be an object.');
	}

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

	return {
		id, path, component, label, extend, target
	};
}

export function orderNormalize(options) {
	if (!Array.isArray(options)) {
		throw new Error('Array is Expected for extend router.');
	}

	return options;
}