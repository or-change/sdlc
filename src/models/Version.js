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
					abstract: { type: 'string' },
					createdAt: { type: 'string' }
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
	VersionList(injection) {
		return {
			schemas: {
				type: 'array',
				items: {
					type: 'model',
					symbol: 'Version'
				}
			},
			methods: {
				async query() {

				}
			}
		};
	}
};