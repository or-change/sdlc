'use strict';

module.exports = function (router, { AccessControl, mountRouter }, { Model, AccessLog }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = await Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name
			}
		});
		
		AccessLog.debug({ type: 'GET /api/account', info: { status: ctx.status }});
	});

	mountRouter('Account', router);
};