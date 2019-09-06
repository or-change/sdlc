'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('trace.create'), async ctx => {
		const { parentId, stageId, versionId, flowId, abstract } = ctx.request.body;

		if (parentId) {
			const trace = await Model.Trace.query(parentId);

			if (!trace) {
				return ctx.throw(400, 'Invalid `request.body.parentId`, parent trace NOT existed.');
			}
		}

		const flow = await Model.Flow.query(flowId);
		const version = await Model.Version.query(versionId);

		if (!flow) {
			ctx.throw(400, 'The flow is NOT exited.');
		}

		if (!flow.stageList[stageId]) {
			ctx.throw(400, 'The stage of flow is NOT exited.');
		}

		if (!version) {
			ctx.throw(400, 'The version is NOT exited.');
		}

		if (abstract && typeof abstract !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.abstract`, string expacted.');
		}

		ctx.body = await Model.Trace.create({
			flowId, stageId,
			versionId, abstract, parentId
		});
	}).get('/', AccessControl('trace.query'), async ctx => {
		ctx.body = await Model.TraceList.query(); //how to choose selector
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