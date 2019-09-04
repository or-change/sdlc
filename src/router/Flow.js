'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('flow.create'), async ctx => {
		const { parentId, name, stageList, evolutioon } = ctx.request.body;

		ctx.body = await Model.Flow.create({
			parentId, name, stageList, evolutioon,
			projectId: ctx.state.project.id
		});
	}).get('/', AccessControl('flow.query'), async ctx => {
		ctx.body = await Model.FlowList.query(ctx.state.project.id);
	}).param('flowId', async (flowId, ctx, next) => {
		const flow = await Model.Flow.query(ctx.state.project.id, flowId);

		if (!flow) {
			return ctx.throw(404, 'Flow is NOT found.');
		}

		ctx.state.flow = flow;

		return next();
	}).get('/:flowId', AccessControl('flow.get'), ctx => {
		ctx.body = ctx.state.flow;
	});

	// delete??
};