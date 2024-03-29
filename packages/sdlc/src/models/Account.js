'use strict';

module.exports = {
	Account(store, { channel, Log }) {
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

					channel.publish('account-created', account.id);
					Log.model({ type: 'create account', info: account.id});

					return account;
				},
				async update(payload) {
					const account = await store.updateAccount(this.id, payload);

					channel.publish('account-updated', account.id);
					Log.model({ type: 'update account', info: account.id});

					return account;
				},
				async query(accountId) {
					return await store.getAccount(accountId);
				},
				async delete() {
					const account = await store.deleteAccount(this.id);

					channel.publish('account-deleted', account.id);
					Log.model({ type: 'delete account', info: account.id});

					return account;
				}
			}
		};
	},
	AccountList(store) {
		const selector = {
			all: store.queryAccountAll,
			name: store.queryAccountByName
		};

		return {
			schemas: {
				type: 'array',
				items: { type: 'model', symbol: 'Account'}
			},
			methods: {
				async query(query) {
					return await selector[query.selector](query.args);
				}
			}
		};
	}
};