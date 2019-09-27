'use strict';

module.exports = function PersonalConfig(store) {
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
				informedMethods: {
					type: 'array',
					items: { type: 'string' }
				}
			}
		},
		methods: {
			async create(payload) {
				const personalConfig = await store.createPersonalConfig(payload);

				return personalConfig;
			},
			async query(accountId) {
				return await store.getPersonalConfig(accountId);
			},
			async update(payload) {
				return await store.updatePersonalConfig(payload.id, payload); 
			}
		}
	};
};