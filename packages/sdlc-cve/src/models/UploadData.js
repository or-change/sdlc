'use strict';

module.exports = {
	UploadData(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: {
						type: 'string'
					},
					assetId: {
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
				}
			}
		};
	},
	UploadDataList(store) {
		const selector = {};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'UploadData'}
			},
			methods: {
				async query(query) {
					return [];
				}
			}
		};
	}
};