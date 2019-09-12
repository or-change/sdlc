'use strict';

const Router = {
	Base: require('./Base'),
	Principal: require('./Principal'),
	Account: require('./Account'),
	Project: require('./Project'),
	Version: require('./Version'),
	Member: require('./Member'), 
	Flow: require('./Flow'),
	Trace: require('./Trace'),
	Admin: require('./Admin')
};

module.exports = {
	prefix: '/api',
	Router: Router.Base,
	use: [
		{
			prefix: '/account',
			Router: Router.Account
		},
		{
			prefix: '/principal',
			Router: Router.Principal
		},
		{
			prefix: '/project',
			Router: Router.Project,
			use: [
				{
					mount: '/:projectId',
					prefix: '/version',
					Router: Router.Version
				},
				{
					mount: '/:projectId',
					prefix: '/member',
					Router: Router.Member
				},
				{
					mount: '/:projectId',
					prefix: '/flow',
					Router: Router.Flow,
				},
				{
					mount: '/:projectId',
					prefix: '/trace',
					Router: Router.Trace
				}
			]
		},
		{
			prefix: '/admin',
			Router: Router.Admin
		},
		{
			prefix: '/plugin',
			Router(router, { mountRouter }) {
				mountRouter('Plugin', router);
			}
		}
	]
};