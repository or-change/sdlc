

const SDLC = require('@or-change/sdlc');
const Store = require('@or-change/sdlc-store-memory');
const git = require('@or-change/sdlc-git');
const poster = require('@or-change/sdlc-poster');
const path = require('path');

module.exports = SDLC({
	store: Store(),
	server: {
		async authenticate(ctx, { Model }) {
			const {
				name
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
	
			return {
				credential: 'simple',
				accountId: accountList[0].id
			};
		},
		// session: {
		// 	get() {

		// 	},
		// 	set() {

		// 	},
		// 	destroy() {

		// 	},
		// 	install() {

		// 	},
		// 	key: ''
		// },
		installed({ product }) {
			product.on('account-created', (account) => { console.log(account); });
		}
	},
	plugins: [
		git,
		poster
	],
	app: {
		extend: path.resolve(__dirname, './app1/SDLCFactory.js')
	}
});