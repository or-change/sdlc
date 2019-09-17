import SDLC from 'sdlc';
import Test from '../app/components/Test';

SDLC.install('oc.com.or-change.cn', extend => {
	extend
		.appendRoutes([
			{
				path: 'test',
				component: Test
			}
		])
		.addTopicItem({
			id: 'test-topic',
			component: Test,
			label: 'git',
			install(extend) {
				extend('add slots');
			}
		});
});