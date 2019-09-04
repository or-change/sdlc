'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('trace.create'), async ctx => {
		const { parentId, stageId, versionId, flowId, abstract } = ctx.requst.body;

		if (parentId && await Model.Trace.query(parentId)) {
			return ctx.throw(400, 'Invalid `request.body.parentId`, parent trace NOT existed.');
		}

		// versionId 路由定义错了或是验证version是否存在？

		if (abstract && typeof abstract !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.abstract`, string expacted.');
		}

		ctx.body = await Model.Trace.create({
			flowId, stageId,
			versionId, abstract, parentId
		});
	}).get('/', AccessControl('trace.query'), async ctx => {
		ctx.body = await Model.TraceList.query(ctx.state.project.id);
	}).param('tranceId', async (tranceId, ctx, next) => {
		const trace = await Model.Trace.query(tranceId);

		if (!trace) {
			return ctx.throw(404, 'Trace is NOT found.');
		}

		ctx.state.trace = trace;

		return next();
	}).get('/:tranceId', AccessControl('trace.get'), ctx => {
		ctx.body = ctx.state.trace;
	});
};