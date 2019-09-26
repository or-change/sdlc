import SDLC from 'sdlc';

import ProjectDetailProperty from './Property';
import ProjectDetailMember from './Member';
import ProjectDetailVersion from './Version';
import ProjectStageTrack from './stageTrack/StageTrack';

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
					},
					{
						path: 'member',
						component: ProjectDetailMember
					},
					{
						path: 'version',
						component: ProjectDetailVersion
					},
					{
						path: 'stage',
						component: ProjectStageTrack
					}
				]);
	
				[
					{
						id: 'project.property',
						label: 'project.property',
						path: 'property'
					},
					{
						id: 'project.member',
						label: 'project.member',
						path: 'member'
					},
					{
						id: 'project.version',
						label: 'project.version',
						path: 'version'
					},
					{
						id: 'project.track',
						label: 'project.track',
						path: 'stage'
					}
				].forEach(topics => appendTopics(topics));
			}
		}
	]
});