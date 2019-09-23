import SDLC from 'sdlc';
import Git from '../app/components/Git';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('com.orchage.sdlc.git', extend => {
	extend
		.addTopicItem({
			id: 'Git-topic',
			component: Git,
			label: 'git.title'
		})
		.appendI18n({
			zh, en
		});
});