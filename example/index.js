'use strict';

const SDLC = require('../index');
const persistence = require('./persistence');

module.exports = SDLC({
	persistence: persistence(),
	server: {
		async authenticate(ctx, Model) {
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
				sdlc.route(function install(route, model) {
					route.get('/test', ctx => {
						ctx.body = 'add success!!';
					});
				});
			}
		}
	]
});