'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('version.create'), async ctx => {
		const { semver, abstract } = ctx.request.body;

		if (semver && typeof semver !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.semver`, string expacted.');
		}

		if (abstract && typeof abstract !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.abstract`, string expacted.');
		}

		ctx.body = await Model.Version.create({
			semver, abstract, projectId: ctx.state.project.id
		});
	}).get('/', AccessControl('version.query'), async ctx => {
		ctx.body = await Model.VersionList.query(ctx.state.project.id);
	}).param('versionId', async (versionId, ctx, next) => {
		const version = await Model.Version.query(ctx.state.project.id, versionId);

		if (!version) {
			return ctx.throw(404, 'Version is NOT found.');
		}

		ctx.state.version = version;

		return next();
	}).get('/:versionId', AccessControl('version.get'), ctx => {
		ctx.body = ctx.state.version;
	}).put('/:versionId', AccessControl('version.update'), async ctx => {
		const { abstract } = ctx.request.body;

		if (abstract && typeof abstract !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.abstract`, string expacted.');
		}

		ctx.body = await ctx.state.version.$update({
			abstract
		});
	});
};