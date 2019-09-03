'use strict';

module.exports = function (router, { product, Model }, { AccessControl, Session }) {
	router.post('/session', AccessControl(), ctx => {

	}).del('/session', AccessControl(), ctx => {

	});
};