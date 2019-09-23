'use strict';

module.exports = {
	AccountInfo(store) {
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
					createdAt: {
						type: 'date'
					}
				}
			},
			methods: {
				async create(payload) {
					const accountInfo = await store.createAccountInfo(payload);

					return accountInfo;
				}
			}
		};
	}
};