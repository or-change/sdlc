'use strict';

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		parentId: { type: ['string' | 'null'] },
		stageList: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					plugins: { type: 'array' }
				},
				required: ['name', 'plugins']
			}
		},
		evolution: {
			type: 'array',
			items: {
				type: 'array'
			}
		},
		promoted: {
			type: 'array',
			items: {
				type: 'boolean'
			}
		},
		initializable: {
			type: 'array',
			items: {
				type: 'boolean'
			}
		}
	},
	required: ['name', 'parentId', 'stageList', 'evolution', 'promoted', 'initializable'],
	additionalProperties: false
};

module.exports = function (router, { AccessControl, mountRouter, Validator  }, { Model }) {
	const validate = Validator.Body(schema);

	router
		.post('/', validate, AccessControl('flow.create'), async ctx => {
			const { parentId, name, stageList, evolution, promoted, initializable } = ctx.request.body;

			if (parentId) {
				const flow = await Model.Flow.query(parentId);

				if (!flow) {
					ctx.throw(400, 'Parent Flow is NOT exist.');
				}
			}

			ctx.body = await Model.Flow.create({
				parentId, name, stageList, evolution,
				promoted, initializable,
				projectId: ctx.state.project.id
			});
		})
		.get('/', AccessControl('flow.query'), async ctx => {
			ctx.body = await Model.FlowList.query({
				selector: 'projectId',
				args: {
					projectId: ctx.state.project.id
				}
			});
		});

	mountRouter('Flow', router);

	router
		.param('flowId', async (flowId, ctx, next) => {
			const flow = await Model.Flow.query(flowId);

			if (!flow) {
				return ctx.throw(404, 'Flow is NOT found.');
			}

			ctx.state.flow = flow;

			return next();
		})
		.get('/:flowId', AccessControl('flow.get'), ctx => {
			ctx.body = ctx.state.flow;
		})
		.put('/:flowId', validate, AccessControl('flow.update'), async ctx => {
			const { stageList } = ctx.request.body;
			const { flow } = ctx.state;

			ctx.body = await flow.$update(Object.assign({}, flow, { stageList }));
		});

	mountRouter('$flow', router, '/:flowId');
};