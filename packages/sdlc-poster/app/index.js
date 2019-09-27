import SDLC from 'sdlc';
import Poster from '../app/components/Poster';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('com.orchange.sdlc.poster', extend => {
	extend
		.addTopicItem({
			id: 'Poster-topic',
			component: Poster,
			label: 'poster.title'
		})
		.appendI18n({ zh, en });
});