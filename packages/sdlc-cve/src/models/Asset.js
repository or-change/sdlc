'use strict';

module.exports = {
	Asset(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: {
						type: 'string'
					},
					name: {
						type: 'string'
					},
					taskId: {
						type: 'string'
					},
					createdAt: {
						type: 'date'
					}
				}
			},
			methods: {
				async create() {
					return {};
				},
				async query() {
					return {};
				},
				async update() {
					return {};
				},
				async delete() {
					return {};
				}
			}
		};
	},
	AssetList(store) {
		const selector = {};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Asset'}
			},
			methods: {
				async query(query) {
					return [];
				}
			}
		};
	}
};