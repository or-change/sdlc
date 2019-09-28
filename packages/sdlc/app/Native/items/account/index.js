import SDLC from 'sdlc';

import AccountProfile from './Account';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('oc.com.sdlc.core.workbench.account.item', {
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
						path: 'profile',
						component: AccountProfile
					}
				]);
	
				appendTopics({
					id: 'account.profile',
					label: 'accountItem.profile',
					icon: 'fas fa-user-cog',
					path: 'profile'
				});
			}
		}
	]
});