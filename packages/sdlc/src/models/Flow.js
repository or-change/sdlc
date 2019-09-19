'use strict';

module.exports = {
	Flow(store, { ModelLog }) {
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
								initializable: { type: 'boolean' },
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
				},
				allowNull: ['parentId']
			},
			methods: {
				async create(payload) {
					const flow = await store.createFlow(payload);

					ModelLog.info({ type: 'create flow', info: flow});

					return flow;
				},
				async query(flowId) {
					return await store.getFlow(flowId);
				}
			}
		};
	},
	FlowList(store) {
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
					},
					allowNull: ['parentId']
				}
			},
			methods: {
				async query(query) {
					const selector = {
						projectId: store.queryFlowByProjectId
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	} 
};
// flow template 有emit必要??