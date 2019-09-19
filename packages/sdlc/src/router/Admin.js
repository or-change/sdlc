'use strict';

module.exports = function (router, { AccessControl, mountRouter }, { Model, AccessLog }) {
	router.use(AccessControl('admin.system')).post('/account',async ctx => {
		const { name, avatarHash, administrator } = ctx.request.body;

		ctx.body = await Model.Account.create({
			name, administrator, avatarHash
		});

		AccessLog.debug({ type: 'POST /api/admin/account', info: { status: ctx.status }});
	}).param('accountId', async (accountId, ctx, next) => {
		const account = await Model.Account.query(accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.account = account;

		return next();
	}).put('/account/:accountId', async ctx => {
		const { administrator } = ctx.request.body;
		const { account } = ctx.state;

		ctx.body = await account.$update(Object.assign({}, account, { administrator }));

		AccessLog.debug({ type: `PUT /api/admin/account/${account.id}`, info: { status: ctx.status }});
	}).del('/account/:accountId', async ctx => {
		ctx.body = await ctx.state.account.$delete();

		AccessLog.debug({ type: `DELETE /api/admin/account/${ctx.state.account.id}`, info: { status: ctx.status }});
	}).get('/project', async ctx => {
		ctx.body = await Model.ProjectList.query({
			selector: 'all'
		});

		AccessLog.debug({ type: 'GET /api/admin/project', info: { status: ctx.status }});
	});

	mountRouter('Admin', router);
};