import SDLC from 'sdlc';

import Project from './Project';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('oc.com.sdlc.core.workbench.project', {
	Plugin({ appendI18n }) {
		appendI18n({
			zh, en
		});
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench',
			install({ appendRoutes, addNavItem }) {
				appendRoutes([
					{
						path: 'project',
						component: Project
					}
				]);
	
				addNavItem({
					id: 'project',
					path: 'project',
					icon: 'fas fa-align-justify',
					label: 'projectAll.label'
				});
			}
		}
	]
});
