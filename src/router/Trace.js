'use strict';

module.exports = function (router, { Model }, { AccessControl }) {
	router.post('/', AccessControl('trace.create'), ctx => {

	}).get('/', AccessControl('trace.query'), ctx => {

	}).get('/:tranceId', AccessControl('trace.get'), ctx => {

	});
};