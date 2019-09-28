import SDLC from 'sdlc';
import AccountConfig from '../app/components/AccountConfig';
import AdminConfig from '../app/components/AdminConfig';
import ProjectConfig from '../app/components/ProjectConfig';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('com.orchange.sdlc.poster', {
	Plugin({ appendI18n }) {
		appendI18n({
			zh, en
		});
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench.account',
			install({ appendRoutes, appendTopics }) {
				appendRoutes([
					{
						path: 'poster',
						component: AccountConfig,
					}
				]);

				appendTopics({
					id: 'Poster',
					label: 'poster.account.title',
					path: 'poster'
				});
			}
		},
		{
			id: 'oc.com.sdlc.core.workbench.project.retrive',
			install({ appendRoutes, appendTopics }) {
				appendRoutes([
					{
						path: 'poster',
						component: ProjectConfig,
					}
				]);

				appendTopics({
					id: 'Poster',
					label: 'poster.project.title',
					path: 'poster'
				});
			}
		},
		{
			id: 'oc.com.sdlc.core.workbench.admin',
			install({ appendRoutes, appendTopics }) {
				appendRoutes([
					{
						path: 'poster',
						component: AdminConfig,
					}
				]);

				appendTopics({
					id: 'Poster',
					label: 'poster.admin.title',
					path: 'poster'
				});
			}
		}
	]
});