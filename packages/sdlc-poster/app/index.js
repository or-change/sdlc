import SDLC from 'sdlc';
import Poster from '../app/components/Poster';

SDLC.install('com.orchange.sdlc.poster', extend => {
	extend
		.appendRoutes([
			{
				path:':accountId/email',
				component: Poster
			}
		])
		.addTopicItem({
			id: 'Poster-topic',
			component: Poster,
			label: {
				sub: 'poster'
			},
			path: 'poster-topic'
		});
});