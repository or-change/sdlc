'use strict';

module.exports = {
	Group(store) {
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
					belongTo: {
						type: 'string'
					},
					createdAt: {
						type: 'date'
					}
				},
				allowNull: ['belongTo']
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
	GroupList(store) {
		const selector = {};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Group'}
			},
			methods: {
				async query(query) {
					return [];
				}
			}
		};
	}
};