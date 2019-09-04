'use strict';

module.exports = {
	Flow(injection) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					parentId: { type: 'string' },
					name: { type: 'string' },
					projectId: { type: 'string' },
					stageList: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								promoted: { type: 'boolean' },
								plugins: {
									type: 'array',
									items: { type: 'string' }
								}
							}
						}
					},
					evolution: {
						type: 'array',
						items: {
							type: 'array',
							items: { type: 'boolean' }
						}
					},
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
	},
	FlowList(injection) {
		return {
			schemas: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						parentId: { type: 'string' },
						name: { type: 'string' },
						projectId: { type: 'string' },
						createdAt: { type: 'date' }
					}
				}
			},
			methods: {
				async query() {
					
				}
			}
		};
	} 
};