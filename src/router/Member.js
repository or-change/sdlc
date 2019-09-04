'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('member.create'), async ctx => {
		ctx.body = await Model.Member.create({
			projectId: ctx.state.project.id,
			accountId: ctx.request.body.accountId,
			inviter: ctx.principal.account.id
		});
	}).get('/', AccessControl('member.query'), async ctx => {
		ctx.body = await Model.MemberList.query(ctx.state.project.id);
	}).param('memberId', async (memberId, ctx, next) => {
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
};