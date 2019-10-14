'use strict';

module.exports = {
	Report(store) {
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
					format: {
						type: 'string'
					},
					filtering: {
						type: 'object',
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
	ReportList(store) {
		const selector = {};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Report'}
			},
			methods: {
				async query(query) {
					return [];
				}
			}
		};
	}
};