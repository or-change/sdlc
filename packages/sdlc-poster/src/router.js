'use strict';

module.exports = function (router, Validator, Model) {
	const { AccountInfo, AdminConfig, PersonalConfig, ProjectOwnerConfig } = Model;

	router.post('/:accountId/email', async ctx => {
		const { email } = ctx.request.body;
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
				email
			});

			return ctx.body = accountInfo;
		} catch (error) {
			if (error) {
				return ctx.throw(500, 'Create accountInfo failed!');
			}
		}
	});

	router.put('/:accountId/email', async ctx => {
		const { email } = ctx.request.body;
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
				email 
			});

			return ctx.body = accountInfo;
		} catch (error) {
			if (error) {
				return ctx.throw(500, error.message);
			}
		}
	});

	router.get('/:accountId/email', async ctx => {
		return ctx.body = await AccountInfo.query(ctx.params.accountId);
	});

	router.post('/:accountId/config/admin', async ctx => {
		const { 
			events,
			projectPreferences,
			informedMethods
		} = ctx.request.body;
		const { accountId } = ctx.params;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		try {
			const adminConfig = await AdminConfig.create({
				events,
				projectPreferences,
				informedMethods
			});

			return ctx.body = adminConfig;
		} catch (error) {
			if (error) {
				return ctx.throw(500, 'Create accountConfig failed!');
			}
		}
	});

	router.get('/:accountId/config/admin', async ctx => {
		const { accountId } = ctx.params;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		return ctx.body = await AdminConfig.query();
	});

	router.get('/:accountId/config', async ctx => {
		const { accountId } = ctx.params;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		return ctx.body = await PersonalConfig.query(accountId);
	});

	router.post('/:accountId/config', async ctx => {
		const {
			events,
			informedMethods
		} = ctx.request.body;
		const { accountId } = ctx.params;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		try {
			const personalConfig = await PersonalConfig.create({
				id: accountId,
				events,
				informedMethods
			});
	
			return ctx.body = personalConfig;
		} catch(error) {
			if(error) {
				return ctx.throw(500, 'Create personalConfig failed!');
			}
		}
	});

	router.put('/:accountId/config', async ctx => {
		const {
			events,
			informedMethods
		} = ctx.request.body;
		const { accountId } = ctx.params;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		try {
			const personalConfig = await PersonalConfig.Instance.prototype.$update({
				id: accountId,
				events,
				informedMethods
			});
	
			return ctx.body = personalConfig;
		} catch(error) {
			if(error) {
				return ctx.throw(500, 'Update personalConfig failed!');
			}
		}
	});

	router.get('/:accountId/config/owner', async ctx => {
		const { accountId } = ctx.params;
		const { projectId } = ctx.request.query;

		if (accountId != ctx.state.session.principal.account.id) {
			return ctx.throw(403, 'Invalid request: the user `accountId` not authenticated.');
		}

		return ctx.body = await ProjectOwnerConfig.query(projectId);
	});

	router.post('/:accountId/config/owner', async ctx => {
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
	});
	
	router.put('/:accountId/config/owner', async ctx => {
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