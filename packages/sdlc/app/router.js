import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Desktop from './components/pages/Desktop';

import DesktopOverview from './components/pages/desktop/Overview';
import DesktopAccount from './components/pages/desktop/Account';

import DesktopProjectAll from './components/pages/desktop/project/All';
import DesktopProjectDetail from './components/pages/desktop/project/Detail';

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
					},
					{
						path: 'project',
						component: DesktopProjectAll
					},
					{
						path: 'project/:projectId',
						component: DesktopProjectDetail
					},
				].concat(workbench)
			}
		].concat(global)
	});
}