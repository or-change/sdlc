'use strict';

module.exports = function (router, { AccessControl, mountRouter }, { Model }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = await Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name 
			}
		});
	});

	mountRouter('Account', router);
};