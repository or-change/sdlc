'use strict'; 

module.exports = function (router, { AccessControl }, { Model }) {
	router.get('/', AccessControl('principal.get'), async ctx => {
		ctx.body = ctx.state.session.principal;
	}).put('/', AccessControl('principal.update'), async ctx => {
		const { name } = ctx.request.body;
		// file => hash(avatarHash)
		const account = await Model.Account.query(ctx.state.session.principal.account.id);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		if (name && typeof name !== 'string') {
			return ctx.throw(400, 'Invalid `request.body.name`, string expacted.');
		}

		ctx.state.session.principal.account = await account.$update(Object.assign({}, account, { name }));
		ctx.body = ctx.state.session.principal;
	});
};