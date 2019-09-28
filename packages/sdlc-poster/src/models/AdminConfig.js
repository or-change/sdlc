'use strict';

module.exports = function AdminConfig(store) {
	return {
		schemas: {
			type: 'object',
			properties: {
				admin: {
					type: 'array',
					items: { type: 'string' }
				},
				projectOwner: {
					type: 'array',
					items: { type: 'string' }
				},
				other: {
					type: 'array',
					items: { type: 'string' }
				}
			}
		},
		methods: {
			async create(payload) {
				const adminConfig = await store.createAdminConfig(payload);

				return adminConfig;
			},
			async query() {
				return await store.getAdminConfig();
			}
		}
	};
};