'use strict';

const schema = {
	type: 'object',
	properties: {
		parentId: { type: 'string' },
		stageId: { type: 'string' },
		versionId: { type: 'string' },
		flowId: { type: 'string' },
		abstract: { type: 'string' }
	},
	required: ['stageId', 'versionId', 'flowId', 'abstract'],
	additionalProperties: false
};

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model }) {

	router
		.post('/',Validator.Body(schema), AccessControl('trace.create'), async ctx => {
			const { parentId, stageId, versionId, flowId, abstract } = ctx.request.body;
			const projectId = ctx.state.project.id;

			const existedTrace = await Model.TraceList.query({
				selector: 'projectId',
				args: {
					projectId: projectId
				}
			});

			const isExisted = existedTrace.find(trace =>
				trace.flowId === flowId && trace.versionId === versionId && trace.stageId === stageId);

			if (isExisted) {
				return ctx.throw(400, 'The trace has EXISTED.');
			}

			const flow = await Model.Flow.query(flowId);

			if (!flow || flow.projectId !== projectId) {
				ctx.throw(400, 'The flow of project is NOT exited.');
			}

			if (!flow.stageList[stageId]) {
				ctx.throw(400, 'The stage of flow is NOT exited.');
			}

			const version = await Model.Version.query(versionId);

			if (!version || version.projectId !== projectId) {
				ctx.throw(400, 'The version of project is NOT exited.');
			}

			const parentTrace = await Model.Trace.query(parentId);

			if (parentId && !parentTrace) {
				return ctx.throw(400, 'Invalid `request.body.parentId`, parent trace NOT existed.');
			}

			const trace = await Model.Trace.create({
				flowId, stageId, projectId,
				versionId, abstract, parentId
			});

			if (parentId && parentTrace) {
				const children =  parentTrace.children.map(trace => trace);
				children.push(trace.id);

				await parentTrace.$update(Object.assign({}, parentTrace, {
					children
				}));
			}

			ctx.body = trace;
		})
		.get('/', AccessControl('trace.query'), async ctx => {
			const { flowId, stageId, versionId } = ctx.query;
			const projectId = ctx.state.project.id;

			const query = {
				selector: 'projectId',
				args: { projectId }
			};

			if (flowId) {
				query.selector = 'flowId';
				query.args = { projectId, flowId };
			}

			if (stageId) {
				query.selector = 'stageId';
				query.args = { projectId, stageId: Number(stageId) };
			}

			if (versionId) {
				query.selector = 'versionId';
				query.args = { projectId, versionId };
			}

			ctx.body = await Model.TraceList.query(query);
		});

	mountRouter('Trace', router);

	router
		.param('traceId', async (tranceId, ctx, next) => {
			const trace = await Model.Trace.query(tranceId);

			if (!trace) {
				return ctx.throw(404, 'Trace is NOT found.');
			}

			ctx.state.trace = trace;

			return next();
		})
		.get('/:tranceId', AccessControl('trace.get'), ctx => {
			ctx.body = ctx.state.trace;
		})
		.del('/:traceId', AccessControl('trace.delete'), async ctx => {
			const { children, id, parentId} = ctx.state.trace;

			if (children.length) {
				ctx.throw(400, 'The trace can NOT be deleted.');
			}

			const parentTrace = await Model.Trace.query(parentId);
			await parentTrace.$update(Object.assign({}, parentTrace, {
				children: parentTrace.children.filter(traceId => traceId !== id)
			}));

			ctx.body = await ctx.state.trace.$delete();
		});

	mountRouter('$trace', router, '/:traceId');
};