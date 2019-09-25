'use strict';

const schema = {
	type: 'object',
	properties: {
		name: { type: 'string' },
		abstract: { type: 'string' }
	},
	required: ['name', 'abstract'],
	additionalProperties: false
};

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model }) {
	const validate = Validator.Body(schema);

	router
		.post('/', validate, AccessControl('project.create'), async ctx => {
			const { name, abstract } = ctx.request.body;

			ctx.body = await Model.Project.create({
				name, abstract,
				ownerId: ctx.state.session.principal.account.id
			});
		})
		.get('/', AccessControl('project.query'), async ctx => {
			ctx.body = await Model.ProjectList.query({
				selector: 'memberOf',
				args: {
					accountId: ctx.state.session.principal.account.id
				}
			});
		});

	mountRouter('Project', router);
	
	router
		.param('projectId', async (projectId, ctx, next) => {
			const project = await Model.Project.query(projectId);

			if (!project) {
				return ctx.throw(404, 'Project is NOT found.');
			}

			ctx.state.project = project;
			ctx.state.memberList = await Model.MemberList.query({
				selector: 'projectId',
				args: {
					projectId
				}
			});

			return next();
		})
		.get('/:projectId', AccessControl('project.get'), ctx => {
			ctx.body = ctx.state.project;
		})
		.put('/:projectId', AccessControl('project.update'), validate, async ctx => {
			const { name, abstract } = ctx.request.body;
			const { project } = ctx.state;

			ctx.body = await project.$update(Object.assign({}, project, { name, abstract}));
		})
		.del('/:projectId', AccessControl('project.delete'), async ctx => {
			ctx.body = await ctx.state.project.$delete();
		});

	mountRouter('$project', router, '/:projectId');
};