import SDLC from 'sdlc';
import Git from '../app/components/Git';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('com.orchage.sdlc.git', {
	Plugin({ appendI18n }) {
		appendI18n({
			zh, en
		});
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench.project.retrive',
			install({ appendRoutes, appendTopics }) {
				appendRoutes([
					{
						path: 'git',
						component: Git,
					}
				]);

				appendTopics({
					id: 'Git-topic',
					label: 'git.title',
					path: 'git'
				});
			}
		}
	]
});