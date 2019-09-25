export function sort(allItems, order) {
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