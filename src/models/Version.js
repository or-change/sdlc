'use strict';

module.exports = {
	Version(store) {
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
					return await store.createVersion(payload);
				},
				async update(payload) {
					return await store.updateVersion(this.id, payload);
				},
				async query(versionId) {
					return await store.getVersion(versionId);
				},
				async delete() {
					return await store.deleteVersion(this.id);
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