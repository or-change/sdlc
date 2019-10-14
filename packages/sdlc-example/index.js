'use strict';
const path = require('path');

const SDLC = require('@or-change/sdlc');
const Store = require('@or-change/sdlc-store-memory');
const git = require('@or-change/sdlc-git');
const register = require('@or-change/sdlc-register');
const poster = require('@or-change/sdlc-poster');
const BasicCredential = require('@or-change/sdlc-basic-credential');
const CVE = require('@or-change/sdlc-cve');

const config = require('./config.json');

const store = Store();

module.exports = SDLC({
	store,
	server: {
		async authenticate(ctx, { Model, BasicCredential }) {
			const {
				name,
				password
			} = ctx.request.body;

			const accountList = await Model.AccountList.query({
				selector: 'name',
				args: {
					name,
				}
			});

			if (!accountList.length) {
				ctx.throw(401);

				return null;
			}

			const success = BasicCredential.validate(accountList[0].id, password);

			if (success) {
				return {
					credential: 'basic',
					accountId: accountList[0].id
				};
			}
		},
		installed({ channelCenter }) {
			channelCenter().subscribe('account-created', (account) => {
				console.log(account);
			});
		}
	},
	plugins: [
		BasicCredential({
			query() {
				return;
			},
			update() {
				return;
			},
			validate() {
				return true;
			}
		}),
		CVE()
	],
	app: {
		extend: path.resolve(__dirname, './app/SDLCFactory.js')
	}
});