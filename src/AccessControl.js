'use strict';

module.exports = {
	asserts: [
		function withoutPrincipal(ctx) {
 
		},
		function withPrincipal(ctx) {

		},
		function administratorOnly(ctx) {
			
		},
		function loggedUserOnly(ctx) {
			
		},
		function memberOfProject(ctx) {

		},
		function projectOwnerOnly(ctx) {

		}
	],
	table: {
		'product.query':    [0, 0, 0, 0, 0, 0],
		'principal.create': [0, 0, 0, 0, 0, 0],
		'principal.get':    [0, 0, 0, 0, 0, 0],
		'principal.delete': [0, 0, 0, 0, 0, 0],
		'account.create':   [0, 0, 0, 0, 0, 0],
		'account.query':    [0, 0, 0, 0, 0, 0],
		'account.get':      [0, 0, 0, 0, 0, 0],
		'account.delete':   [0, 0, 0, 0, 0, 0],
		'project.create':   [0, 0, 0, 0, 0, 0],
		'project.query':    [0, 0, 0, 0, 0, 0],
		'project.get':      [0, 0, 0, 0, 0, 0],
		'project.update':   [0, 0, 0, 0, 0, 0],
		'project.delete':   [0, 0, 0, 0, 0, 0],
		'version.create':   [0, 0, 0, 0, 0, 0],
		'version.query':    [0, 0, 0, 0, 0, 0],
		'version.get':      [0, 0, 0, 0, 0, 0],
		'version.update':   [0, 0, 0, 0, 0, 0],
		'member.create':    [0, 0, 0, 0, 0, 0],
		'member.query':     [0, 0, 0, 0, 0, 0],
		'member.get':       [0, 0, 0, 0, 0, 0],
		'member.delete':    [0, 0, 0, 0, 0, 0],
		'flow.create':      [0, 0, 0, 0, 0, 0],
		'flow.query':       [0, 0, 0, 0, 0, 0],
		'flow.get':         [0, 0, 0, 0, 0, 0],
		'trace.create':     [0, 0, 0, 0, 0, 0],
		'trace.query':      [0, 0, 0, 0, 0, 0],
		'trace.get':        [0, 0, 0, 0, 0, 0],
		'admin.system':     [0, 0, 0, 0, 0, 0]
	}
};