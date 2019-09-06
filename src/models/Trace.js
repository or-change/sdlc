'use strict';

module.exports = {
	Trace(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					parentId: { type: 'string' },
					flowId: { type: 'string' },
					stageId: { type: 'number' },
					versionId: { type: 'string' },
					abstract: { type: 'string' },
					createdAt: { type: 'date' }
				},
				allowNull: ['parentId']
			},
			methods: {
				async create(payload) {
					return await store.createTrace(payload);
				},
				async query(traceId) {
					return await store.getTrace(traceId);
				}
			}
		};
	},
	TraceList(store) {
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
				async query(query) {
					const selector = {
						flowId: store.getTraceByFlowId,
						stageId: store.getTraceByStageId,
						versionId: store.getTraceByVersionId,
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	}
};