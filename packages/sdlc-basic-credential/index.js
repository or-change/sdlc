'use strict';

const path = require('path');
const normalize = require('./src/normalizeOptions');
const meta = require('./package.json');

module.exports = function SDLCBasicCredencial(options) {
	const finalOptions = normalize(options);

	const registry = {
		async get(accountId) {
			return await finalOptions.query(accountId);
		},
		async set(accountId, password) {
			const credencial = await finalOptions.transform(password);

			return await finalOptions.update(accountId, credencial);
		}
	};

	return {
		id: 'Com.Orchange.SDLC.BasicCredencial',
		name: meta.name,
		version: meta.version,
		description: meta.description,
		entry: path.join(__dirname, './app/index.js'),
		routers: {
			Admin(router, { Model }) {
				router
					.put('/account/:accountId/password', async ctx => {
						const { accountId } = ctx.params;
						const account = await Model.Account.query(accountId);

						if (!account) {
							return ctx.throw(404, `Account (id=${accountId}) is NOT found.`);
						}

						await registry.set(accountId, ctx.request.body.password);
						ctx.body = { type: 'basic' };
					});
			},
			Principal(router) {
				router
					.put('/password', async ctx => {
						const { principal } = ctx.state.session;

						if (!principal) {
							return ctx.throw(403);
						}

						const { account } = principal;

						await registry.set(account.id, ctx.request.body.password);
						ctx.body = { type: 'basic' };
					});
			}
		},
		install({ injection }) {
			injection.BasicCredential = {
				async validate(accountId, password) {
					const credencial = await registry.get(accountId);
					const transformedPassword = await finalOptions.transform(password);

					return credencial !== null &&
						await finalOptions.validate(credencial, transformedPassword);
				}
			};
		}
	};
};