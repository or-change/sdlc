const sdlc = require('./index');
const { server } = require('./config.json');

sdlc.server.listen(server.port, () => {
	console.log('server start 80');
});