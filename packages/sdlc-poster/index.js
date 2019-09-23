const path = require('path');
const Model = require('./src/model');

module.exports = {

	id: 'com.orchange.sdlc.poster',
	name: 'poster',
	description: 'Monitor events and send mail',
	install(injection) {
		const channel = injection.channel;

		Object.keys(channel.list).forEach(channelName => {
			channel.on(channelName, function (a) {
				console.log(a);
			});
		});
	},
	models: Model,
	routers: {
		Principal: (router, context) => {
			const { Validator } = context;

			router.post('/:accountId/email', async ctx => {
				const { email } = ctx.request.body;
				const { accountId } = ctx.params; 

				if (accountId != ctx.state.session.principal.id) {
					return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
				}

				try {
					const accountInfo = await accountInfo.create({
						id: accountId,
						email
					});

					return ctx.body = accountInfo;
				} catch (error) {
					if (error) {
						return ctx.throw(500, 'Create accountInfo failed!');
					}
				}
	},
	entry: path.join(__dirname, './app/index.js')
};