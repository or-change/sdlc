'use strict';

module.exports = {
	Project(store, { product, ModelLog }) {
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

					ModelLog.info({ type: 'create project', info: project});
					return project;
				},
				async update(payload) {
					const project = await store.updateProject(this.id, payload);
					product.emit('project-updated', project);
					ModelLog.info({ type: 'update project', info: project});

					return project;
				},
				async query(projectId) {
					return await store.getProject(projectId);
				},
				async delete() {
					const project = await store.deleteProject(this.id);
					product.emit('project-deleted', project);
					ModelLog.info({ type: 'delete project', info: project});

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
	Member(store, { ModelLog }) {
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
					const member = await store.createMember(payload);

					ModelLog.info({ type: 'create member', info: member});

					return member;
				},
				async update(payload) {
					const member = await store.updateMember(this.id, payload);

					ModelLog.info({ type: 'delete member', info: member});

					return member;
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