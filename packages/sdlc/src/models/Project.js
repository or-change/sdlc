'use strict';

module.exports = {
	Project(store, { product }) {
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
					const project = await store.createProject(payload);
					product.emit('project-created', project);

					return project;
				},
				async update(payload) {
					const project = await store.updateProject(this.id, payload);
					product.emit('project-updated', project);

					return project;
				},
				async query(projectId) {
					return await store.getProject(projectId);
				},
				async delete() {
					const project = await store.deleteProject(this.id);
					product.emit('project-deleted', project);

					return project;
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