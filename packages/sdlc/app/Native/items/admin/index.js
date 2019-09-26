import SDLC from 'sdlc';

import Admin from './Admin';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('oc.com.sdlc.core.workbench.admin.item', {
	Plugin({ appendI18n }) {
		appendI18n({
			zh, en
		});
	},
	installers: [
		{
			id: 'oc.com.sdlc.core.workbench.admin',
			install({ appendRoutes, appendTopics }) {
				appendRoutes([
					{
						path: 'plugins',
						component: Admin
					}
				]);
	
				appendTopics({
					id: 'admin.plugins',
					label: 'product.label',
					path: 'plugins'
				});
			}
		}
	]
});