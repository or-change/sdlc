import SDLC from 'sdlc';

import Overview from './Overview';

import zh from './i18n/zh.yaml';
import en from './i18n/en.yaml';

SDLC.install('oc.com.sdlc.core.workbench.overview', {
	Plugin({ appendI18n }) {
		appendI18n({
			zh, en
		});
	},
	installer: {
		id: 'oc.com.sdlc.core.workbench',
		install({ appendRoutes, addNavItem }) {
			appendRoutes([
				{
					path: 'overview',
					component: Overview
				}
			]);

			addNavItem({
				id: 'overview',
				path: 'overview',
				label: 'overview.label'
			});
		}
	}
});
