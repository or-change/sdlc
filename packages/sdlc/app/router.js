import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import SignIn from './components/pages/SignIn.vue';
import Desktop from './components/pages/Desktop.vue';

import DesktopOverview from './components/pages/desktop/Overview.vue';
import DesktopAccount from './components/pages/desktop/Account.vue';

import DesktopProjectAll from './components/pages/desktop/project/All.vue';
import DesktopProjectDetail from './components/pages/desktop/project/Detail.vue';

export default function Router(pluginRouterOptions) {
	return new VueRouter({
		routes: [
			{
				path: '/',
				redirect: '/desktop'
			},
			{
				path: '/signin',
				component: SignIn,
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
						component: DesktopAccount
					},
					{
						path: 'project',
						component: DesktopProjectAll
					},
					{
						path: 'project/:projectId',
						component: DesktopProjectDetail
					},
				]
			}
		].concat(pluginRouterOptions)
	});
}