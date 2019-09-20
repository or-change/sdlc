'use strict';
const path = require('path');

module.exports = function registerPlugin() {
	return {
		id: 'com.orchange.sdlc.register',
		name: 'register',
		description: 'plugin register',
		routers: {
			Account: (router, context, injection) => {
				const { Account } = injection.Model;
				const { Validator } = context;

				router.post('/register', async ctx => {
					// const validate = Validator({
					// 	type: 'object',
					// 	properties: {
					// 		name: {
					// 			type: 'string'
					// 		},
					// 		administrator: {
					// 			type: 'boolean'
					// 		},
					// 		avatarHash: {
					// 			type: 'string'
					// 		}
					// 	},
					// 	additionalProperties: false,
					// 	required: ['name', 'administrator']
					// })(ctx.request.body);

					// if (!validate) {
					// 	return ctx.throw(400, 'Invalid parameter: missing parameter `name` or `administrator`');
					// }

					const { name, administrator, avatarHash } = ctx.request.body;
					const payload = {
						name,
						administrator: Boolean(administrator),
					};

					payload.avatarHash = avatarHash === undefined ? null : avatarHash;
					
					const account = await Account.create(payload);

					return ctx.body = account;
				});
			}
		},
		entry: path.join(__dirname, '/app/index.js')
	};
};