'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = await Model.AccountList.query();
	}).param('accountId', async (accountId, ctx, next) => {
		const account = await Model.Account.query(accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.account = account;

		return next();
	}).get('/:accountId', AccessControl('account.get'), ctx => {
		ctx.body = ctx.state.account;
	}).put('/:accountId', AccessControl('account.put'), async ctx => {
		const { name } = ctx.request.body;
		const { account } = ctx.state;

		if (name && typeof name !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
		}

		const newAccount = await account.$update(Object.assign({}, account.$data, { name }));
		ctx.state.session.principal =
			Object.assign({}, ctx.state.session.principal, { account: newAccount});

		ctx.body = newAccount;
	});
};