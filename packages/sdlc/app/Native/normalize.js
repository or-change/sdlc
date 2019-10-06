function normalize(options) {
	const { id, label, icon, badge, ownerOnly } = options;

	if (!id) {
		throw new Error('options.id is need.');
	}

	if (typeof label !== 'string') {
		throw new Error('options.label is Expected be a string.');
	}

	if (icon && typeof icon !== 'string') {
		throw new Error('options.icon is Expected be a string.');
	}

	if (badge && typeof badge !== 'string') {
		throw new Error('options.badge is Expected be a string.');
	}

	if (ownerOnly && typeof ownerOnly !== 'boolean') {
		throw new Error('options.badge is Expected be a string.');
	}
}

export function itemNormalize(options) {
	const { id, path, label, icon, badge, items, ownerOnly } = options;

	normalize(options);

	if (items) {
		if (!Array.isArray(items)) {
			throw new Error('options.items is Expected be an Array.');
		}

		items.forEach(item => {
			if (typeof item.path !== 'string') {
				throw new Error('options.path is Expected be a String.');
			}

			normalize(item);
		});

		return {
			id, label, icon, badge, items, ownerOnly
		};
	}
	
	if (typeof path !== 'string') {
		throw new Error('options.path is Expected be a String.');
	}

	return {
		id, path, label, icon, badge, ownerOnly
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