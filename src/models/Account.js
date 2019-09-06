'use strict';

module.exports = {
	Account(store) {
		return {
			schemas: {
				type: 'object',
				properties: {
					id: { type: 'string' },
					name: { type: 'string' },
					avatarHash: { type: 'string' },
					administrator: { type: 'boolean'},
					createdAt: { type: 'date'}
				},
				allowNull: ['avatarHash']
			},
			methods: {
				async create(payload) {
					return await store.createAccount(payload);
				},
				async update(payload) {
					return await store.updateAccount(this.id, payload);
				},
				async query(accountId) {
					return await store.getAccount(accountId);
				},
				async delete() {
					return await store.deleteAccount(this.id);
				}
			}
		};
	},
	// 用户信息，用户摘要信息
	AccountList(store) {
		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account'}
			},
			methods: {
				async query(query) {
					const selector = {
						all: store.queryAccountAll,
						name: store.queryAccountByName
					};

					return await selector[query.selector](query.args);
				}
			}
		};
	}
};