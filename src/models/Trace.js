'use strict';

module.exports = {
	Trace(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					parentId: { type: 'string' },
					flowId: { type: 'string' },
					stageId: { type: 'number' },
					versionId: { type: 'string' },
					createdAt: { type: 'date' }
				}
			},
			methods: {
				async create() {

				},
				async query() {

				}
			}
		};
	}
};