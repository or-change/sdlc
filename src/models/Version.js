'use strict';

module.exports = {
	Version(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					semver: { type: 'string' },
					projectId: { type: 'string' },
					createdAt: { type: 'string' }
				}
			},
			methods: {
				async create() {

				},
				async query() {

				},
				async delete() {

				}
			}
		};
	}
};