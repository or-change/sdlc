'use strict';

module.exports = function (router,
	{ AccessControl }, { product, Model, Plugin, authenticate, injection, AuthenticationLog }) {

	router
		.get('/product', AccessControl('product.query'), ctx => {
			ctx.body = Object.assign({}, product.meta, {
				plugins: Plugin.plugins
			});
		})
		.post('/session/principal', AccessControl('session.principal.create'), async ctx => {
			const authentication = await authenticate(ctx, injection);

			if (!authentication) {
				product.emit('authentication-failed');
				AuthenticationLog.error(`Authentication failed. body: ${JSON.stringify(ctx.request.body)}`);

				return;
			}

			const { credential, accountId } = authentication;

			if (!credential || !accountId) {
				throw new Error('Invalid authenticate return.');
			}

			const authedAt = Date.now();
			const account = await Model.Account.query(accountId);
			const principal = { authedAt, credential, account };

			product.emit('authentication-succeed', principal);
			AuthenticationLog(`Authentication succeed. principal: ${JSON.stringify(principal)}`);

			ctx.state.session.principal = principal;
			ctx.body = principal;
		})
		.use(async (ctx, next) => {
			const principal = await ctx.state.session.principal;

			if (!principal) {
				return ctx.throw(403, 'Unauthenticated.');
			}

			return next();
		})
		.del('/session/principal', AccessControl('session.principal.delete'), async ctx => {
			ctx.body = ctx.state.session.principal;
			delete ctx.state.session.principal;
		});
};