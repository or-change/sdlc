'use strict';

module.exports = function BaseRouter(router, { AccessControl }, {
	product,
	Model,
	Plugin,
	authenticate,
	injection,
	Log,
	channel
}) {
	router
		.get('/product', AccessControl('product.query'), ctx => {
			ctx.body = Object.assign({}, product.meta, {
				plugins: Plugin.plugins
			});
		})
		.post('/session/principal', AccessControl('session.principal.create'), async ctx => {
			const authentication = await authenticate(ctx, injection);

			if (!authentication) {
				channel.publish('authentication-failed');
				Log.authentication.error('Authentication failed.');

				return;
			}

			const { credential, accountId } = authentication;

			if (!credential || !accountId) {
				throw new Error('Invalid authenticate return.');
			}

			const authedAt = Date.now();
			const account = await Model.Account.query(accountId);
			const principal = { authedAt, credential, account };

			channel.publish('authentication-succeed', principal);
			Log.authenticate.info(`Authentication succeed. credentia: ${principal.credential}, accountId: ${principal.account.id}`);
			ctx.state.session.principal = principal;
			ctx.body = principal;
		})
		.del('/session/principal', AccessControl('session.principal.delete'), async ctx => {
			ctx.body = ctx.state.session.principal;
			delete ctx.state.session.principal;
		});
};