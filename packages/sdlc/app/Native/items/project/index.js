import SDLC from 'sdlc';

import ProjectDetailProperty from './Property';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('oc.com.sdlc.core.workbench.project.retrive.item', {
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
						path: 'property',
						component: ProjectDetailProperty
					}
				]);
	
				[
					{
						id: 'project.property',
						label: 'project.property',
						icon: 'fas fa-grip-vertical',
						path: 'property'
					}
				].forEach(topics => appendTopics(topics));
			}
		}
	]
});