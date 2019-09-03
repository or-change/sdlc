'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('flow.create'), ctx => {

	}).get('/', AccessControl('flow.query'), ctx => {

	}).get('/:flowId', AccessControl('flow.get'), ctx => {

	}).del('/:flowId', AccessControl('flow.delete'), ctx => {

	});
};