import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn';
import Desktop from './components/pages/Desktop';

import DesktopAccount from './components/pages/desktop/Account';
import DesktopAdmin from './components/pages/desktop/Admin';

import DesktopProjectDetail from './components/pages/desktop/Project';

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
						path: 'account',
						component: DesktopAccount,
						children: account
					},
					{
						path: 'admin',
						component: DesktopAdmin,
						children: admin
					},
					{
						path: 'project/:projectId',
						component: DesktopProjectDetail,
						children: project
					},
				].concat(workbench)
			}
		].concat(global)
	});
}