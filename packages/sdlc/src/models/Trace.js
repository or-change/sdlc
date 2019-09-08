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
				type: 'array',
				items: {
					type: 'model',
					symbol: 'Trace'
				}
			},
			methods: {
				async query(query) {
					const selector = {
						flowId: store.queryTraceByFlowId,
						// stageId: store.queryTraceByStageId,
						versionId: store.queryTraceByVersionId,
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	}
};