'use strict';

module.exports = {
	Account(store, { product, ModelLog }) {
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
					const account = await store.createAccount(payload);
					product.emit('account-created', account);

					ModelLog.info({ type: 'create account', info: account});

					return account;
				},
				async update(payload) {
					const account = await store.updateAccount(this.id, payload);
					product.emit('account-updated', account);

					ModelLog.info({ type: 'update account', info: account});

					return account;
				},
				async query(accountId) {
					return await store.getAccount(accountId);
				},
				async delete() {
					const account = await store.deleteAccount(this.id);
					product.emit('account-deleted', account);

					ModelLog.info({ type: 'delete account', info: account});

					return account;
				}
			}
		};
	},
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