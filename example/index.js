'use strict';

const SDLC = require('../index');
const { server } = require('./config.json');

SDLC({
	data: {
		id: 'com.orchange.sdlc'
	},
	plugins: []
}).server.listen(server.port, () => {
	console.log('server start 80');
});