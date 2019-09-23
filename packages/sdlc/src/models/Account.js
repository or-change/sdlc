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

					channel.emit('account-created', account);
					Log.model({ type: 'create account', info: account});

					return account;
				},
				async update(payload) {
					const account = await store.updateAccount(this.id, payload);

					channel.emit('account-updated', account);
					Log.model({ type: 'update account', info: account});

					return account;
				},
				async query(accountId) {
					return await store.getAccount(accountId);
				},
				async delete() {
					const account = await store.deleteAccount(this.id);

					channel.emit('account-deleted', account);
					Log.model({ type: 'delete account', info: account});

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