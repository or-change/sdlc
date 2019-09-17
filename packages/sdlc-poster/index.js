const path = require('path');

module.exports = {
	id: 'com.test.poster',
	name: 'poster',
	install(injection) {
	},
	routers: {
		Account: (router) => {
			router.get('/test', ctx => {
				ctx.body = 'add success!!';
			});
		},
		$project: (router, context, injection) => {
			router.get('/test', ctx => {
				console.log(context, injection);
				ctx.body = ctx.state.project;
			});
		},
		Plugin: (router) => {
			router.get('/test', ctx => {
				ctx.body = 'add success!!';
			});
		}
	},
	entry: path.join(__dirname, './app/index.js')
};