'use strict';

module.exports = function registerPlugin() {
	return {
		id: 'com.orchange.sdlc.register',
		name: 'register',
		description: 'plugin register',
		routers: {
			Account: (router, context, injection) => {
				const { Account } = injection.Model;

				router.post('/register', async ctx => {
					const { 
						name, 
						administrator,
						avatarHash
					} = ctx.request.body;

					if (!name|| !administrator) {
						return ctx.throw(400, 'The parameter `name` and `admininster` are expected');
					}

					const payload = {
						name,
						administrator,
					};
					payload.avatarHash = avatarHash === undefined ? null : avatarHash;
					const account = await Account.create(payload);

					ctx.body = account;
				});
			}
		}
	};
};