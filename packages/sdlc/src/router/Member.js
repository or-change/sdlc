'use strict';

module.exports = function (router, { AccessControl, mountRouter }, { Model }) {
	router.post('/', AccessControl('member.create'), async ctx => {
		const account = await Model.Account.query(ctx.request.body.accountId);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.body = await Model.Member.create({
			projectId: ctx.state.project.id,
			accountId: ctx.request.body.accountId,
			inviter: ctx.state.session.principal.account.id
		});
	}).get('/', AccessControl('member.query'), async ctx => {
		ctx.body = await Model.MemberList.query({
			selector: 'projectId',
			args: {
				projectId: ctx.state.project.id
			}
		});
	});

	mountRouter('Member', router);
	
	router.param('memberId', async (memberId, ctx, next) => {
		const member = await Model.Member.query(memberId);

		if (!member) {
			return ctx.throw(404, 'Member is Not found.');
		}

		ctx.state.member = member;

		return next();
	}).get('/:memberId', AccessControl('member.get'), ctx => {
		ctx.body = ctx.state.member;
	}).del('/:memberId', AccessControl('member.delete'), async ctx => {
		ctx.body = await ctx.state.member.$update();
	});

	mountRouter('$member', router, '/:memberId');
};