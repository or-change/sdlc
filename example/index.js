'use strict';

const SDLC = require('../index');
const { server } = require('./config.json');

SDLC({
	data: {
		id: 'com.orchange.sdlc'
	},
	plugins: [
		{
			id: 'com.test.test',
			name: 'test',
			install(sdlc) {
				sdlc.route(function install(route, model) {
					route.get('/test', ctx => {
						ctx.body = 'add success!!';
					});
				});
			}
		}
	]
}).server.listen(server.port, () => {
	console.log('server start 80');
});