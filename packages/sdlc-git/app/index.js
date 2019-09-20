import SDLC from 'sdlc';
import Git from '../app/components/Git';

SDLC.install('com.orchage.sdlc.git', extend => {
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
			label: { 
				sub: 'git' 
			},
			path: 'git-topic',
		});
});