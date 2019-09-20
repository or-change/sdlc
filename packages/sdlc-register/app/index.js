import SDLC from 'sdlc';
import Register from '../app/components/Register';

SDLC.install('oc.com.or-change.cn', extend => {
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
			label: 'register',
			install(extend) {
				extend('add slots');
			}
		});
});