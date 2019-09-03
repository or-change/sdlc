'use strict';

module.exports = {
	Project(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					owner: { type: 'string' },
					language: { type: 'string' },
					abstract: { type: 'string' },
					createdAt: { type: 'date' }
				}
			},
			methods: {
				async create() {

				},
				async update() {

				},
				async query() {

				},
				async delete() {

				}
			}
		};
	},
	ProjectList(injection) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Project'}
			},
			methods: {
				async query() {

				}
			}
		};
	},
	Member(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					accountId: { type: 'string' },
					joinedAt: { type: 'date' },
					exitedAt: { type: 'date' }
				}
			},
			methods: {
				async create() {

				},
				async update() {

				},
				async query() {

				}
			}
		};
	}
};