'use strict';

module.exports = {
	Task(store) {
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
					groupId: {
						type: 'string'
					},
					createdAt: {
						type: 'date'
					},
					startedAt: {
						type: 'date'
					},
					endedAt: {
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
	TaskList(store) {
		const selector = {};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Task'}
			},
			methods: {
				async query(query) {
					return [];
				}
			}
		};
	}
};