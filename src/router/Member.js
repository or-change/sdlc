'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('member.create'), ctx => {

	}).get('/', AccessControl('member.query'), ctx => {

	}).get('/:memberId', AccessControl('member.get'), ctx => {

	}).del('/:memberId', AccessControl('member.delete'), ctx => {

	});
};