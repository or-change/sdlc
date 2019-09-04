'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.use(AccessControl('admin.system')).post('/account',async ctx => {
		const { name, password, administrator } = ctx.requst.body;

		ctx.body = await Model.Account.create({
			name, password, administrator
		});
	}).param('accountId', async (accountId, ctx, next) => {
		const account = await Model.Account.query(accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.account = account;

		return next();
	}).put('/account/:accountId', async ctx => {
		const { password, administrator } = ctx.requst.body;
		const { account } = ctx.state;

		ctx.body = await account.$update(Object.assign({}, account.$data, { password, administrator }));
	}).del('/account/:accountId', async ctx => {
		ctx.body = await ctx.state.account.$delete();
	}).get('/project', async ctx => {
		ctx.body = await Model.ProjectList.query();
	});
};