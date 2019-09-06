'use strict';

module.exports = {
	Project(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					ownerId: { type: 'string' },
					language: { type: 'string' },
					abstract: { type: 'string' },
					createdAt: { type: 'date' }
				}
			},
			methods: {
				async create(payload) {
					return await store.createProject(payload);
				},
				async update(payload) {
					return await store.updateProject(this.id, payload);
				},
				async query(projectId) {
					return await store.getProject(projectId);
				},
				async delete() {
					return await store.deleteProject(this.id);
				}
			}
		};
	},
	ProjectList(store) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Project'}
			},
			methods: {
				async query(query) {
					const selector = {
						all: store.queryProjectAll,
						ownerId: store.queryProjectByOwnerId,
						memberOf: store.queryProjectByMember
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	},
	Member(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					projectId: { type: 'string' },
					accountId: { type: 'string' },
					inviter: { type: 'string' },
					joinedAt: { type: 'date' },
					exitedAt: { type: 'date' }
				},
				allowNull: ['exitedAt']
			},
			methods: {
				async create(payload) {
					return await store.createMember(payload);
				},
				async update(payload) {
					return await store.updateMember(this.id, payload);
				},
				async query(memberId) {
					return await store.getMember(memberId);
				}
			}
		};
	},
	MemberList(store) {
		return {
			schemas: {
				type: 'array',
				items: {
					type: 'model',
					symbol: 'Member'
				}
			},
			methods: {
				async query(query) {
					const selector = {
						projectId: store.queryMemberByProjecyId,
						accountId: store.queryMemberByAccountId
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	}
};