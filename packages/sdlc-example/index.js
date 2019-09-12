'use strict';

const SDLC = require('@or-change/sdlc');
const Store = require('@or-change/sdlc-store-memory');

module.exports = SDLC({
	store: Store(),
	server: {
		async authenticate(ctx, { Model }) {
			const {
				name
			} = ctx.request.body;
	
			const accountList = await Model.AccountList.query({
				selector: 'name',
				args: {
					name,
				}
			});
	
			if (!accountList.length) {
				ctx.throw(401);
	
				return null;
			}
	
			return {
				credential: 'simple',
				accountId: accountList[0].id
			};
		},
		// session: {
		// 	get() {

		// 	},
		// 	set() {

		// 	},
		// 	destroy() {

		// 	},
		// 	install() {

		// 	},
		// 	key: ''
		// },
		installed({ product }) {
			product.on('account-created', (account) => { console.log(account); });
		}
	},
	plugins: [
		{
			id: 'com.test.test',
			name: 'test',
			install(injection) {
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
				Plugin: (router) => {
					router.get('/test', ctx => {
						ctx.body = 'add success!!';
					});
				}
			},
			entry: ['./server.js']
		}
	]
});