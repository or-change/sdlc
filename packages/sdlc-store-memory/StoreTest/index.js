'use strict';

const assert = require('assert');
const schemas = require('./schemas');
const { Validator } = require('@or-change/duck');

module.exports = function (store) {
	const describe = global.describe || function () {};
	const it = global.it || function () {};
	const before = global.before || function () {};

	describe('Store Testing', () => {
		let account, project, version, flow;

		before(async () => {
			account = await store.createAccount({
				name: 'test', administrator: true, avatarHash: null
			});
	
			project = await store.createProject({
				name: 'project 1', ownerId: 'user1', language: 'java', abstract: ''
			});
	
			version = await store.createVersion({
				semver: '1.0.0', projectId: project.id, abstract: ''
			});
	
			flow = await store.createFlow({
				parentId: null, name: 'flow1', projectId: project.id,
				stageList: [],  evolution: [[]]
			});
		});

		describe('Account Testing', () => {
			const accountValidatot = Validator(schemas.account);

			it('Create account', async () => {
				const account = await store.createAccount({
					name: 'createtest', administrator: true, avatarHash: null
				});
	
				accountValidatot(account);
			});
		
			it('Query account', async () => {
				const accountList = await store.queryAccountAll();
		
				if (Array.isArray(accountList)) {
					accountList.forEach(account => {
						accountValidatot(account);
					});
				} else {
					assert.ok(false, 'return value of queryAccountAll should be an Array.');
				}
			});
		
			it('Query account by name', async () => {
				const accountList = await store.queryAccountByName({
					name: account.name
				});
		
				if (Array.isArray(accountList)) {
					accountList.forEach(account => {
						accountValidatot(account);
					});
				} else {
					assert.ok(false, 'return value of queryAccountByName should be an Array.');
				}
			});
		
			it('Get account', async () => {
				accountValidatot(await store.getAccount(account.id));
			});
		
			it('Update account', async () => {
				accountValidatot(await store.updateAccount(account.id, {
					name: 'test-update'
				}));
			});
		
			it('Delete account', async () => {
				accountValidatot(await store.deleteAccount(account.id));
			});
		});

		describe('Project Testing', () => {
			const projectValidator = Validator(schemas.project);

			it('Create project', async () => {
				projectValidator(await store.createProject({
					name: 'project 1', ownerId: 'user1', language: 'java', abstract: ''
				}));
			});
	
			it('Query project', async () => {
				const projectList = await store.queryProjectAll();
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => projectValidator(project));
				} else {
					assert.ok(false, 'return value of queryProjectAll should be an Array.');
				}
			});
	
			it('Query project by owner', async () => {
				const projectList = await store.queryProjectByOwnerId({
					accountId: 1
				});
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => projectValidator(project));
				} else {
					assert.ok(false, 'return value of queryProjectByOwnerId should be an Array.');
				}
			});
	
			it('Query project by member', async () => {
				const projectList = await store.queryProjectByMember({
					accountId: 1
				});
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => projectValidator(project));
				} else {
					assert.ok(false, 'return value of queryProjectByMember should be an Array.');
				}
			});
	
			it('Get project', async () => {
				projectValidator(await store.getProject(project.id));
			});
	
			it('Update project', async () => {
				projectValidator(await store.updateProject(project.id, {
					name: 'project 1 update'
				}));
			});
	
			it('Delete project', async () => {
				projectValidator(await  store.deleteProject(project.id));
			});
		});

		describe('Version Testing', () => {
			const versionValidator = Validator(schemas.version);

			it('Create version', async () => {
				versionValidator(await store.createVersion({
					semver: '1.0.1', projectId: project.id, abstract: ''
				}));
			});

			it('Query version by projectId', async () => {
				const versionList = await store.queryVersionByProjectId({ projectId: '1' });

				if (Array.isArray(versionList)) {
					versionList.forEach(version => versionValidator(version));
				} else {
					assert.ok(false, 'return value of queryVersionByProjectId should be an Array.');
				}
			});

			it('Get version', async () => {
				versionValidator(await store.getVersion(version.id));
			});

			it('Update version', async () => {
				versionValidator(await store.updateVersion(version.id, {
					abstract: 'test'
				}));
			});
		});

		describe('Member Testing', () => {
			let member;
			const memberValidator = Validator(schemas.member);

			before(async () => {
				member = await store.createMember({
					projectId: project.id, accountId: account.id, inviter: account.id
				});
			});

			it('Create member', async () => {
				memberValidator(await store.createMember({
					projectId: project.id, accountId: account.id, inviter: account.id
				}));
			});

			it('Query member by projectId', async () => {
				const memberList = await store.queryMemberByProjecyId({project: project.id });

				if (Array.isArray(memberList)) {
					memberList.forEach(member => memberValidator(member));
				} else {
					assert.ok(false, 'return value of queryMemberByProjecyId should be an Array.');
				}
			});

			it('Query member by accountId', async () => {
				const memberList = await store.queryMemberByAccountId({account: account.id });

				if (Array.isArray(memberList)) {
					memberList.forEach(member => memberValidator(member));
				} else {
					assert.ok(false, 'return value of queryMemberByAccountId should be an Array.');
				}
			});

			it('Get member', async () => {
				memberValidator(await store.getMember(member.id));
			});

			it('Update member', async () => {
				memberValidator(await store.updateMember(member.id));
			});
		});

		describe('Flow Testing', () => {
			const flowValidator = Validator(schemas.flow);

			it('Create flow', async () => {
				flowValidator(await store.createFlow({
					parentId: null, name: 'flow1', projectId: project.id,
					stageList: [],  evolution: [[]]
				}));
			});

			it('Query flow by projectId', async () => {
				const flowList = await store.queryFlowByProjectId({ projectId: project.id });

				if (Array.isArray(flowList)) {
					flowList.forEach(flow => flowValidator(flow));
				} else {
					assert.ok(false, 'return value of queryFlowByProjectId should be an array.');
				}
			});

			it('Get flow', async () => {
				flowValidator(await store.getFlow(flow.id));
			});
		});

		describe('Trace Testing', () => {
			let trace;
			const traceValidator = Validator(schemas.trace);

			before(async () => {
				trace = await store.createTrace({
					parentId: null, flowId: flow.id, stageId: 0, versionId: version.id, abstract: ''
				});
			});

			it('Create trace', () => {
				traceValidator(trace);
			});

			it('Query trace by flowId', async () => {
				const traceList = await store.queryTraceByFlowId({ flowId: flow.id });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => traceValidator(trace));
				} else {
					assert.ok(false, 'return value of queryTraceByFlowId should be an array.');
				}
			});

			it('Query trace by stageId', async () => {
				const traceList = await store.queryTraceByStageId({ stageId: 0 });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => traceValidator(trace));
				} else {
					assert.ok(false, 'return value of queryTraceByStageId should be an array.');
				}
			});

			it('Query trace by versionId', async () => {
				const traceList = await store.queryTraceByVersionId({ versionId: version.id });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => traceValidator(trace));
				} else {
					assert.ok(false, 'return value of queryTraceByVersionId should be an array.');
				}
			});

			it('Get trace', async () => {
				traceValidator(await store.getTrace(trace.id));
			});
		});
	});
};