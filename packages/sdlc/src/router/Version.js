'use strict';

const semverValidate = require('semver');

const createSchema = {
	type: 'object',
	properties: {
		semver: { type: 'string' },
		abstract: { type: 'string' }
	},
	required: ['semver', 'abstract'],
	additionalProperties: false
};
const updateSchema = {
	type: 'object',
	properties: {
		abstract: { type: 'string' }
	},
	required: ['abstract'],
	additionalProperties: false
};

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model }) {
	router
		.post('/', Validator.Body(createSchema), AccessControl('version.create'), async ctx => {
			const { semver, abstract } = ctx.request.body;

			if (!semverValidate.valid(semver)) {
				return ctx.throw(400, 'Invalid `request.body.semver`.');
			}

			ctx.body = await Model.Version.create({
				semver, abstract, projectId: ctx.state.project.id
			});
		})
		.get('/', AccessControl('version.query'), async ctx => {
			ctx.body = await Model.VersionList.query({
				selector: 'projectId',
				args: {
					projectId: ctx.state.project.id
				}
			});
		});

	mountRouter('Version', router);
	
	router
		.param('versionId', async (versionId, ctx, next) => {
			const version = await Model.Version.query(versionId);

			if (!version) {
				return ctx.throw(404, 'Version is NOT found.');
			}

			ctx.state.version = version;

			return next();
		})
		.get('/:versionId', AccessControl('version.get'), ctx => {
			ctx.body = ctx.state.version;
		})
		.put('/:versionId', Validator.Body(updateSchema), AccessControl('version.update'), async ctx => {
			const { abstract } = ctx.request.body;

			ctx.body = await ctx.state.version.$update({
				abstract
			});
		});

	mountRouter('$version', router, '/:versionId');
};