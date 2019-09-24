import SDLC from 'sdlc';

import DesktopOverview from './Overview';
import DesktopProjectAll from './project/All';

import AccountProfile from './Account';
import ProjectDetailProperty from './project/Property';
import ProjectDetailMember from './project/Member';
import ProjectDetailVersion from './project/Version';
import ProjectStageTrack from './project/stageTrack/StageTrack';

const routes = [
	{
		path: 'overview',
		component: DesktopOverview
	},
	{
		path: 'project',
		component: DesktopProjectAll
	}
];

const navItems = [
	{
		id: 'overview',
		label: 'desktop.overview',
		path: 'overview'
	},
	{
		id: 'project',
		label: 'desktop.project',
		path: 'project'
	}
];

const topicItems = [
	{
		id: 'project.property',
		label: 'project.property',
		component: ProjectDetailProperty
	},
	{
		id: 'project.member',
		label: 'project.member',
		component: ProjectDetailMember
	},
	{
		id: 'project.version',
		label: 'project.version',
		component: ProjectDetailVersion
	},
	{
		id: 'project.track',
		label: 'project.track',
		component: ProjectStageTrack
	}
];

SDLC.install('oc.com.sdlc.core', (extender) => {
	extender.appendRoutes(routes);
	navItems.forEach(navItem => extender.addNavItem(navItem));
	topicItems.forEach(topic => extender.addTopicItem(topic));

	extender.addAccountItem({
		id: 'account.profile',
		component: AccountProfile,
		label: 'account.profile'
	});
});