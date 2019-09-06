'use strict';

module.exports = function (router,
	{ product, Model, pluginManager, authenticate }, { AccessControl }) {
	router.get('/product', AccessControl('product.query'), ctx => {
		ctx.body = Object.assign({}, product.meta, {
			plugins: pluginManager.pluginList
		});
	}).post('/session/principal', AccessControl('session.principal.create'), async ctx => {
		const authentication = await authenticate(ctx, Model);

		if (!authentication) {
			return;
		}

		const { credential, accountId } = authentication;

		if (!credential || !accountId) {
			throw new Error('Invalid authenticate return.');
		}

		const authedAt = Date.now();
		const account = await Model.Account.query(accountId);

		const principal = { authedAt, credential, account };

		ctx.state.session.principal = principal;
		ctx.body = principal;
	}).use(async (ctx, next) => {
		const principal = await ctx.state.session.principal;

		if (!principal) {
			return ctx.throw(403, 'Unauthenticated.');
		}

		return next();
	}).del('/session/principal', AccessControl('session.principal.delete'), async ctx => {
		ctx.body = ctx.state.session.principal;
		delete ctx.state.session.principal;
	});
};