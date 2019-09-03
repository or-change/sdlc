'use strict';

module.exports = {
	Flow(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					parentId: { type: 'string' },
					stageList: {
						type: 'array',
						items: {
							type: 'object'
						}
					}
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