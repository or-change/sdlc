'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('project.create'), ctx => {

	}).get('/', AccessControl('project.query'), ctx => {

	}).get('/:projectId', AccessControl('project.get'), ctx => {

	}).put('/:projectId', AccessControl('project.update'), ctx => {

	}).del('/:projectId', AccessControl('project.delete'), ctx => {

	});
};