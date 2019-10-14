'use strict';

module.exports = function (router, Validator, Model) {
	const { AccountInfo, AdminConfig, ProjectOwnerConfig } = Model;

	router
		.post('/:accountId/config', async ctx => {
			const { email, events, informMethods } = ctx.request.body;
			const { accountId } = ctx.params;
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

			if (accountId != ctx.state.session.principal.account.id) {
				return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
			}

			if (!emailReg.test(email)) {
				return ctx.throw(400, 'Invalid parameter: `email` format incorrectly.');
			}

			try {
				const accountInfo = await AccountInfo.create({
					id: accountId,
					email,
					events,
					informMethods
				});

				return ctx.body = accountInfo;
			} catch (error) {
				if (error) {
					return ctx.throw(500, 'Create accountInfo failed!');
				}
			}
		})
		.put('/:accountId/config', async ctx => {
			const { email, events, informMethods } = ctx.request.body;
			const { accountId } = ctx.params;
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

			if (accountId != ctx.state.session.principal.account.id) {
				return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
			}

			if (!emailReg.test(email)) {
				return ctx.throw(400, 'Invalid parameter: `email` format incorrectly.');
			}

			try {
				const accountInfo = await AccountInfo.Instance.prototype.$update({
					id: accountId,
					email,
					events,
					informMethods
				});

				return ctx.body = accountInfo;
			} catch (error) {
				if (error) {
					return ctx.throw(500, error.message);
				}
			}
		})
		.get('/:accountId/config', async ctx => {
			return ctx.body = await AccountInfo.query(ctx.params.accountId);
		})
		.post('/:accountId/config/admin', async ctx => {
			const {
				admin,
				projectOwner,
				other
			} = ctx.request.body;
			const { accountId } = ctx.params;

			if (accountId != ctx.state.session.principal.account.id) {
				return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
			}

			try {
				const adminConfig = await AdminConfig.create({
					admin,
					projectOwner,
					other
				});

				return ctx.body = adminConfig;
			} catch (error) {
				if (error) {
					return ctx.throw(500, 'Create accountConfig failed!');
				}
			}
		})
		.get('/config/admin', async ctx => {
			return ctx.body = await AdminConfig.query();
		})
		.get('/config/owner', async ctx => {
			const { projectId } = ctx.request.query;

			return ctx.body = await ProjectOwnerConfig.query(projectId);
		})
		.post('/:accountId/config/owner', async ctx => {
			const {
				projectId,
				events,
				informedMethods,
				projectPreferences
			} = ctx.request.body;
			const { accountId } = ctx.params;

			if (accountId != ctx.state.session.principal.account.id) {
				return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
			}

			try {
				const projectOwnerConfig = await ProjectOwnerConfig.create({
					id: projectId,
					events,
					informedMethods,
					projectPreferences
				});

				return ctx.body = projectOwnerConfig;
			} catch (error) {
				if (error) {
					return ctx.throw(500, 'Create projectOwnerConfig failed!');
				}
			}
		})
		.put('/:accountId/config/owner', async ctx => {
			const {
				projectId,
				events,
				informedMethods,
				projectPreferences
			} = ctx.request.body;
			const { accountId } = ctx.params;

			if (accountId != ctx.state.session.principal.account.id) {
				return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
			}

			try {
				const projectOwnerConfig = await ProjectOwnerConfig.Instance.prototype.$update({
					id: projectId,
					events,
					informedMethods,
					projectPreferences
				});

				return ctx.body = projectOwnerConfig;
			} catch (error) {
				if (error) {
					return ctx.throw(500, 'Update projectOwnerConfig failed!');
				}
			}
		});
};