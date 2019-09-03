'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = Model.AccountList.query();
	}).param('accountId', async (id, ctx, next) => {
		const account = await Model.Account.query(id);

		if (!account) {
			return;
		}

		ctx.state.account = account;

		next();
	}).get('/:accountId', AccessControl('account.get'), async ctx => {
		ctx.body = ctx.state.account;
	}).put('/:accountId', AccessControl('account.put'), async ctx => {
		const account = await ctx.state.account.$update(ctx.request.body);


	});
};