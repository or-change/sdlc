'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = await Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name
			}
		});
	});
};