'use strict';

module.exports = function (router, { AccessControl }, { Model }) {
	router.get('/', AccessControl('account.query'), async ctx => {
		ctx.body = await Model.AccountList.query({
			selector: 'name',
			args: {
				name: ctx.query.name
			}
		});
	});
};