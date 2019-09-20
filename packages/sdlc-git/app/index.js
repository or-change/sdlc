import SDLC from 'sdlc';
import Git from '../app/components/Git';

SDLC.install('oc.com.or-change.cn', extend => {
	extend
		.appendRoutes([
			{
				path: 'git',
				component: Git
			}
		])
		.addTopicItem({
			id: 'Git-topic',
			component: Git,
			label: 'git',
			install(extend) {
				extend('add slots');
			}
		});
});