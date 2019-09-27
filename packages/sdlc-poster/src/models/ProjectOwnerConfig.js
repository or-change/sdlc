'user strict';

module.exports = function ProjectOwnerConfig(store) {
	return {
		schemas: {
			type: 'object',
			properties: {
				id: {
					type: 'string'
				},
				events: {
					type: 'array',
					items: { type: 'string' }
				},
				projectPreferences: {
					type: 'array',
					items: { type: 'string' }
				},
				informedMethods: {
					type: 'array',
					items: { type: 'string' }
				}
			}
		},
		methods: {
			async create(payload) {
				return await store.createProjectOwnerConfig(payload);
			},
			async query(projectId) {
				return await store.getProjectOwnerConfig(projectId);
			},
			async update(payload) {
				return await store.updateProjectOwnerConfig(payload.id, payload);
			}
		}
	};
};