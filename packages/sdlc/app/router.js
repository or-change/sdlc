import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Desktop from './components/pages/Desktop';

import DesktopOverview from './components/pages/desktop/Overview';
import DesktopAccount from './components/pages/desktop/Account';
import DesktopAdmin from './components/pages/desktop/Admin';

import AccountProfile from './components/pages/desktop/account/Profile';

import DesktopProjectAll from './components/pages/desktop/project/All';
import DesktopProjectDetail from './components/pages/desktop/project/Detail';

import ProjectDetailProperty from './components/pages/desktop/project/detail/Property';
import ProjectDetailMember from './components/pages/desktop/project/detail/member/Member';
import ProjectDetailVersion from './components/pages/desktop/project/detail/version/Version';
import ProjectStageTrack from './components/pages/desktop/project/detail/stageTrack/StageTrack';

export default function Router({ routes, AuthenticationPage, home }) {
	const { global, workbench, account, admin, project } = routes;

	return new VueRouter({
		routes: [
			{
				path: '/',
				redirect: '/desktop'
			},
			{
				path: '/signin',
				component: AuthenticationPage ? AuthenticationPage : SignIn,
				meta: {
					unauthencated: true
				}
			},
			{
				path: '/desktop',
				component: Desktop,
				meta: {
					authencated: true
				},
				children: [
					{
						path: '',
						redirect: 'overview'
					},
					{
						path: 'overview',
						component: DesktopOverview
					},
					{
						path: 'account',
						component: DesktopAccount,
						children: [
							{
								path: '',
								redirect: 'profile'
							},
							{
								path: 'profile',
								component: AccountProfile,
							},
							{
								path: 'accountb',
								component: ProjectDetailVersion,
							}
						].concat(account)
					},
					{
						path: 'admin',
						component: DesktopAdmin,
						children: [

						].concat(admin)
					},
					{
						path: 'project',
						component: DesktopProjectAll
					},
					{
						path: 'project/:projectId',
						component: DesktopProjectDetail,
						children: [
							{
								path: '',
								redirect: 'property'
							},
							{
								path: 'property',
								component: ProjectDetailProperty,
							},
							{
								path: 'member',
								component: ProjectDetailMember,
							},
							{
								path: 'version',
								component: ProjectDetailVersion,
							},
							{
								path: 'track',
								component: ProjectStageTrack,
							},
						].concat(project)
					},
				].concat(workbench)
			}
		].concat(global)
	});
}