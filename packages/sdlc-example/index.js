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
		}
	},
	plugins: [
		{
			id: 'com.test.test',
			name: 'test',
			install(sdlc) {
			},
			route(route) {
				route.get('/test', ctx => {
					ctx.body = 'add success!!';
				});
			}
		}
	]
});