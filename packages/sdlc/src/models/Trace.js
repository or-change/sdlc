'use strict';

module.exports = {
	Trace(store, { Log }) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					parentId: { type: 'string' },
					children: {
						type: 'array',
						items: {
							type: 'string'
						}
					},
					projectId: { type: 'string' },
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
					const trace = await store.createTrace(payload);

					Log.model({ type: 'create trace', info: trace});

					return trace;
				},
				async query(traceId) {
					return await store.getTrace(traceId);
				},
				async update(payload) {
					const trace = await store.updateTrace(this.id, payload);

					Log.model({ type: 'update trace', info: trace});

					return trace;
				},
				async delete() {
					const trace = await store.deleteTrace(this.id);

					Log.model({ type: 'delete trace', info: trace});

					return trace;
				}
			}
		};
	},
	TraceList(store) {
		const selector = {
			projectId: store.queryTraceByProjectId,
			flowId: store.queryTraceByFlowId,
			stageId: store.queryTraceByStageId,
			versionId: store.queryTraceByVersionId
		};

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
					return await selector[query.selector](query.args);
				}
			}
		};
	}
};