'use strict';

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model, AccessLog }) {
	const validate = Validator.Body({
		type: 'object',
		properties: {
			name: { type: 'string' },
			language: { type: 'string' },
			abstract: { type: 'string' }
		},
		required: ['name', 'language', 'abstract'],
		additionalProperties: false
	});

	router.post('/', validate, AccessControl('project.create'), async ctx => {
		const { name, language, abstract } = ctx.request.body;

		ctx.body = await Model.Project.create({
			name, language, abstract,
			ownerId: ctx.state.session.principal.account.id
		});

		AccessLog.debug({ type: 'POST /api/project', info: { status: ctx.status }});
	}).get('/', AccessControl('project.query'), async ctx => {
		ctx.body = await Model.ProjectList.query({
			selector: 'memberOf',
			args: {
				accountId: ctx.state.session.principal.account.id
			}
		});

		AccessLog.debug({ type: 'GET /api/project', info: { status: ctx.status }});
	});

	mountRouter('Project', router);
	
	router.param('projectId', async (projectId, ctx, next) => {
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
	}).get('/:projectId', AccessControl('project.get'), ctx => {
		ctx.body = ctx.state.project;

		AccessLog.debug({ type: `GGET /api/project/${ctx.state.project.id}`, info: { status: ctx.status }});
	}).put('/:projectId', AccessControl('project.update'), validate, async ctx => {
		const { name, language, abstract } = ctx.request.body;
		const { project } = ctx.state;

		ctx.body = await project.$update(Object.assign({}, project, { name, language, abstract}));

		AccessLog.debug({ type: `PUT /api/project/${ctx.state.project.id}`, info: { status: ctx.status }});
	}).del('/:projectId', AccessControl('project.delete'), async ctx => {
		ctx.body = await ctx.state.project.$delete();

		AccessLog.debug({ type: `DELETE /api/project/${ctx.state.project.id}`, info: { status: ctx.status }});
	});

	mountRouter('$project', router, '/:projectId');
};