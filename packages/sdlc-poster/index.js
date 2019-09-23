const path = require('path');

module.exports = {
	id: 'com.test.poster',
	name: 'poster',
	install(injection) {
		const channel = injection.channel;

		Object.keys(channel.list).forEach(channelName => {
			channel.on(channelName, function (a) {
				console.log(a);
			});
		});
	},
	models: {
		AccountInfo(store) {
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
	
						return account;
					},
					async update(payload) {
						const account = await store.updateAccount(this.id, payload);
	
						return account;
					},
					async query(accountId) {
						return await store.getAccount(accountId);
					},
					async delete() {
						const account = await store.deleteAccount(this.id);
	
						return account;
					}
				}
			};
		}
	},
	routers: {
		Account: (router) => {
			router.get('/test', ctx => {
				ctx.body = 'add success!!';
			});
		},
		$project: (router, context, injection) => {
			router.get('/test', ctx => {
				console.log(context, injection);
				ctx.body = ctx.state.project;
			});
		},
		Plugin: (router, context, { Model }) => {
			router.get('/test', ctx => {
				Model.AccountInfo.query();

				ctx.body = 'add success!!';
			});
		}
	},
	entry: path.join(__dirname, './app/index.js')
};