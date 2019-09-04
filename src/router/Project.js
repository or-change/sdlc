'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	function validate(ctx, next) {
		const { name, language, abstract } = ctx.request.body;

		if (name && typeof name !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
		}

		if (language && typeof language !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.language`, string expacted.');
		}

		if (abstract && typeof abstract !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.abstract`, string expacted.');
		}

		return next();
	}

	router.post('/', AccessControl('project.create'), validate, async ctx => {
		const { name, language, abstract } = ctx.request.body;

		ctx.body = await Model.Project.create({
			name, language, abstract,
			ownerId: ctx.principal.account.id
		});
	}).get('/', AccessControl('project.query'), async ctx => {
		ctx.body = await Model.ProjectList.query(ctx.principal.account.id);
	}).param('projectId', async (projectId, ctx, next) => {
		const project = await Model.Project.query(projectId);

		if (!project) {
			return ctx.throw(404, 'Project is NOT found.');
		}

		ctx.state.project = project;

		return next();
	}).get('/:projectId', AccessControl('project.get'), ctx => {
		ctx.body = ctx.state.project;
	}).put('/:projectId', AccessControl('project.update'), validate, async ctx => {
		const { name, language, abstract } = ctx.request.body;
		const { project } = ctx.state;

		ctx.body = await project.$update(Object.assign({}, project.$data, { name, language, abstract}));
	}).del('/:projectId', AccessControl('project.delete'), async ctx => {
		ctx.body = await ctx.state.project.$delete();
	});
};