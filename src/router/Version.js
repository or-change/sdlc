'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('version.create'), ctx => {

	}).get('/', AccessControl('version.query'), ctx => {

	}).get('/:versionId', AccessControl('version.get'), ctx => {

	}).put('/:versionId', AccessControl('version.update'), ctx => {

	}).del('/:versionId', AccessControl('version.delete'), ctx => {

	});
};