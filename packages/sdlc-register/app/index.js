import SDLC from 'sdlc';
import Register from '../app/components/Register';

SDLC.install('com.orchange.sdlc.register', extend => {
	extend
		.appendRoutes([
			{
				path: 'register',
				component: Register
			}
		])
		.addTopicItem({
			id: 'register-topic',
			component: Register,
			label: {
				sub: 'register'
			},
			path: 'register-topic'
		});
});