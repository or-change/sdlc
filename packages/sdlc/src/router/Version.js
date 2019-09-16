'use strict';

const semverValidate = require('semver');

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model, ServiceLogger }) {
	router.post('/', Validator.Body({
		type: 'object',
		properties: {
			semver: { type: 'string' },
			abstract: { type: 'string' }
		},
		required: ['semver', 'abstract'],
		additionalProperties: false
	}), AccessControl('version.create'), async ctx => {
		const { semver, abstract } = ctx.request.body;

		if (!semverValidate.valid(semver)) {
			return ctx.throw(400, 'Invalid `request.body.semver`.');
		}

		ctx.body = await Model.Version.create({
			semver, abstract, projectId: ctx.state.project.id
		});

		ServiceLogger.debug({ type: `POST /api/project/${ctx.state.project.id}/version`, info: { status: ctx.status }});
	}).get('/', AccessControl('version.query'), async ctx => {
		ctx.body = await Model.VersionList.query({
			selector: 'projectId',
			args: {
				projectId: ctx.state.project.id
			}
		});

		ServiceLogger.debug({ type: `GET /api/project/${ctx.state.project.id}/version`, info: { status: ctx.status }});
	});

	mountRouter('Version', router);
	
	router.param('versionId', async (versionId, ctx, next) => {
		const version = await Model.Version.query(versionId);

		if (!version) {
			return ctx.throw(404, 'Version is NOT found.');
		}

		ctx.state.version = version;

		return next();
	}).get('/:versionId', AccessControl('version.get'), ctx => {
		ctx.body = ctx.state.version;

		ServiceLogger.debug({ type: `GET /api/project/${ctx.state.project.id}/version/${ctx.status.version.id}`, info: { status: ctx.status }});
	}).put('/:versionId', Validator.Body({
		type: 'object',
		properties: {
			abstract: { type: 'string' }
		},
		required: ['abstract'],
		additionalProperties: false
	}), AccessControl('version.update'), async ctx => {
		const { abstract } = ctx.request.body;

		ctx.body = await ctx.state.version.$update({
			abstract
		});

		ServiceLogger.debug({ type: `PUT /api/project/${ctx.state.project.id}/version/${ctx.status.version.id}`, info: { status: ctx.status }});
	});

	mountRouter('$version', router, '/:versionId');
};