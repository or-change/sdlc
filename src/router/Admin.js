'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/account', AccessControl('account.post'), ctx => {

	}).del('/account/:accountId', AccessControl('account.delete'), ctx => {

	}).put('/project/:projectId', AccessControl('project.update'). ctx => {

	});
};