'use strict';

module.exports = {
	Version(store, { ModelLog }) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					semver: { type: 'string' },
					projectId: { type: 'string' },
					abstract: { type: 'string' },
					createdAt: { type: 'date' }
				}
			},
			methods: {
				async create(payload) {
					const version = await store.createVersion(payload);

					ModelLog({ type: 'create version', info: version });

					return version;
				},
				async update(payload) {
					const version = await store.updateVersion(this.id, payload);

					ModelLog({ type: 'update version', info: version });
					
					return version;
				},
				async query(versionId) {
					return await store.getVersion(versionId);
				}
			}
		};
	},
	VersionList(store) {
		return {
			schemas: {
				type: 'array',
				items: {
					type: 'model',
					symbol: 'Version'
				}
			},
			methods: {
				async query(query) {
					const selector = {
						projectId: store.queryVersionByProjectId
					};
					
					return await selector[query.selector](query.args);
				}
			}
		};
	}
};