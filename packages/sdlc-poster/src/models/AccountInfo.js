'use strict';

module.exports = function AccountInfo(store) {
	return {
		schemas: {
			type: 'object',
			properties: {
				id: {
					type: 'string'
				},
				email: {
					type: 'string'
				},
				events: {
					type: 'array',
					items: { type: 'string' }
				},
				informMethods: {
					type: 'array',
					items: { type: 'string' }
				},
				createdAt: {
					type: 'date'
				}
			}
		},
		methods: {
			async create(payload) {
				return await store.createAccountInfo(payload);
			},
			async query(accountId) {
				return await store.getAccountInfo(accountId);
			},
			async update(payload) {
				return await store.updateAccountInfo(payload.id, payload);
			}
		}
	};
};