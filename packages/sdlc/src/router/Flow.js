'use strict';

module.exports = function (router, { AccessControl, mountRouter, Validator  }, { Model, ServiceLogger }) {
	router.post('/', Validator.Body({
		type: 'object',
		properties: {
			name: { type: 'string' },
			stageList: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						promoted: { type: 'boolean' },
						initializable: { type: 'boolean' },
						plugins: { type: 'array' }
					},
					required: ['name', 'promoted', 'initializable', 'plugins']
				}
			},
			evolution: {
				type: 'array',
				items: {
					type: 'array'
				}
			}
		},
		required: ['name', 'stageList', 'evolution'],
		additionalProperties: false
	}), AccessControl('flow.create'), async ctx => {
		const { parentId, name, stageList, evolution } = ctx.request.body;

		if (parentId) {
			const flow = await Model.Flow.query(parentId);

			if (!flow) {
				ctx.throw(400, 'Parent Flow is NOT exist.');
			}
		}

		ctx.body = await Model.Flow.create({
			parentId, name, stageList, evolution,
			projectId: ctx.state.project.id
		});

		ServiceLogger.debug({ type: `POST /api/project/${ctx.state.project.id}/flow`, info: { status: ctx.status }});
	}).get('/', AccessControl('flow.query'), async ctx => {
		ctx.body = await Model.FlowList.query({
			selector: 'projectId',
			args: {
				projectId: ctx.state.project.id
			}
		});

		ServiceLogger.debug({ type: `GET /api/project/${ctx.state.project.id}/flow`, info: { status: ctx.status }});
	});

	mountRouter('Flow', router);
	
	router.param('flowId', async (flowId, ctx, next) => {
		const flow = await Model.Flow.query(flowId);

		if (!flow) {
			return ctx.throw(404, 'Flow is NOT found.');
		}

		ctx.state.flow = flow;

		return next();
	}).get('/:flowId', AccessControl('flow.get'), ctx => {
		ctx.body = ctx.state.flow;

		ServiceLogger.debug({ type: `POST /api/project/${ctx.state.project.id}/flow/${ctx.state.flow.id}`, info: { status: ctx.status }});
	});

	mountRouter('Flow', router, '/:flowId');
};