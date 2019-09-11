'use strict';

const _ = 0;
const $ = 1;

module.exports = {
	asserts: [
		function withoutPrincipal(ctx) {
			return !ctx.state.session.principal;
		},
		function withPrincipal(ctx) {
			return !!ctx.state.session.principal;
		},
		function administratorOnly(ctx) {
			return ctx.state.session.principal.account.administrator;
		},
		function memberOfProject(ctx) {
			return ctx.state.session.principal.account.id === ctx.state.project.ownerId || 
				ctx.state.memberList.find(member => {
					return ctx.state.session.principal.account.id === member.accountId;
				});
		},
		function projectOwnerOnly(ctx) {
			return ctx.state.session.principal.account.id === ctx.state.project.ownerId;
		}
	],
	table: {
		'product.query':                   [_, _, _, _, _],
		'session.principal.create':        [$, _, _, _, _],
		'session.principal.delete':        [_, $, _, _, _],
		'principal.get':                   [_, _, _, _, _],
		'principal.update':                [_, _, _, _, _],
		'account.create':                  [_, _, _, _, _],
		'account.query':                   [_, _, _, _, _],
		'account.delete':                  [_, _, _, _, _],
		'project.create':                  [_, $, _, _, _],
		'project.query':                   [_, $, _, _, _],
		'project.get':                     [_, $, _, $, _],
		'project.update':                  [_, $, _, _, $],
		'project.delete':                  [_, $, _, _, $],
		'version.create':                  [_, $, _, _, $],
		'version.query':                   [_, $, _, $, _],
		'version.get':                     [_, $, _, $, _],
		'version.update':                  [_, $, _, _, $],
		'member.create':                   [_, $, _, _, $],
		'member.query':                    [_, $, _, $, _],
		'member.get':                      [_, $, _, $, _],
		'member.delete':                   [_, $, _, _, $],
		'flow.create':                     [_, $, _, _, $],
		'flow.query':                      [_, $, _, $, _],
		'flow.get':                        [_, $, _, $, _],
		'trace.create':                    [_, $, _, _, $],
		'trace.query':                     [_, $, _, $, _],
		'trace.get':                       [_, $, _, $, _],
		'trace.delete':                    [_, $, _, $, _],
		'admin.system':                    [_, $, $, _, _]
	}
};