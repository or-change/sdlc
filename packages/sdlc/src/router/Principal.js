'use strict'; 

module.exports = function (router, { AccessControl, mountRouter, Validator }, { Model, ServiceLogger }) {
	router.get('/', AccessControl('principal.get'), async ctx => {
		ctx.body = ctx.state.session.principal;

		ServiceLogger.debug({ type: 'GET /api/principal', info: { status: ctx.status }});
	}).put('/', Validator.Body({
		type: 'object',
		properties: {
			name: { type: 'string' }
		}
	}), AccessControl('principal.update'), async ctx => {
		const { name } = ctx.request.body;
		// file => hash(avatarHash)
		const account = await Model.Account.query(ctx.state.session.principal.account.id);

		if (!account) {
			return ctx.throw(404, 'Account is NOT found.');
		}

		ctx.state.session.principal.account = await account.$update(Object.assign({}, account, { name }));
		ctx.body = ctx.state.session.principal;

		ServiceLogger.debug({ type: 'PUT /api/principal', info: { status: ctx.status }});
	});

	mountRouter('Principal', router);
};