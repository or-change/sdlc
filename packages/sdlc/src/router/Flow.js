'use strict';

module.exports = function (router, { AccessControl }, { Model }) {
	router.post('/', AccessControl('flow.create'), async ctx => {
		const { parentId, name, stageList, evolution } = ctx.request.body;

		if (parentId) {
			const flow = await Model.Flow.query(parentId);

			if (!flow) {
				ctx.throw(400, 'Parent Flow is NOT exist.');
			}
		}

		if (typeof name !== 'string') {
			ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
		}

		if (!Array.isArray(stageList)) {
			ctx.throw(400, 'Invalid `request.body.stageList`, array expacted.');
		}

		if (!Array.isArray(evolution)) {
			ctx.throw(400, 'Invalid `request.body.evolution`, array expacted.');
		}

		stageList.forEach(stage => {
			if (typeof stage !== 'object') {
				ctx.throw(400, 'Invalid item of `request.body.stageList`, object expacted.');
			}

			const { name, promoted, initializable, plugins } = stage;

			if (typeof name !== 'string') {
				ctx.throw(400, 'Invalid name of stage, string expacted.');
			}

			if (typeof promoted !== 'boolean') {
				ctx.throw(400, 'Invalid promoted of stage, boolean expacted.');
			}

			if (typeof initializable !== 'boolean') {
				ctx.throw(400, 'Invalid initializable of stage, boolean expacted.');
			}

			if (!Array.isArray(plugins)) {
				ctx.throw(400, 'Invalid plugins of stage, array expacted.');
			}
		});

		evolution.forEach(item => {
			if (!Array.isArray(item)) {
				ctx.throw(400, 'Invalid item of evolution, array expacted.');
			}
		});

		ctx.body = await Model.Flow.create({
			parentId, name, stageList, evolution,
			projectId: ctx.state.project.id
		});
	}).get('/', AccessControl('flow.query'), async ctx => {
		ctx.body = await Model.FlowList.query({
			selector: 'projectId',
			args: {
				project: ctx.state.project.id
			}
		});
	}).param('flowId', async (flowId, ctx, next) => {
		const flow = await Model.Flow.query(flowId);

		if (!flow) {
			return ctx.throw(404, 'Flow is NOT found.');
		}

		ctx.state.flow = flow;

		return next();
	}).get('/:flowId', AccessControl('flow.get'), ctx => {
		ctx.body = ctx.state.flow;
	});
};