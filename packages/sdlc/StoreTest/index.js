'use strict';

const assert = require('assert');
const schemas = require('./schemas');

function getResult(object) {
	const result = {};

	for (let key in object) {
		if (Array.isArray(object[key])) {
			result[key] = 'array';
			continue;
		}

		if (object[key] instanceof Date) {
			result[key] = 'date';
			continue;
		}

		result[key] = typeof object[key];
	}

	return result;
}

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
			it('Create account', async () => {
				const account = await store.createAccount({
					name: 'createtest', administrator: true, avatarHash: null
				});
	
				assert.deepEqual(schemas.Account(account.avatarHash), getResult(account));
			});
		
			it('Query account', async () => {
				const accountList = await store.queryAccountAll();
		
				if (Array.isArray(accountList)) {
					accountList.forEach(account => {
						assert.deepEqual(schemas.Account(account.avatarHash), getResult(account));
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
						assert.deepEqual(schemas.Account(account.avatarHash), getResult(account));
					});
				} else {
					assert.ok(false, 'return value of queryAccountByName should be an Array.');
				}
			});
		
			it('Get account', async () => {
				const accountRetrive = await store.getAccount(account.id);
		
				assert.deepEqual(schemas.Account(accountRetrive.avatarHash), getResult(accountRetrive));
			});
		
			it('Update account', async () => {
				const accountRetrive = await store.updateAccount(account.id, {
					name: 'test-update'
				});
		
				assert.deepEqual(schemas.Account(accountRetrive.avatarHash), getResult(accountRetrive));
			});
		
			it('Delete account', async () => {
				const accountRetrive = await store.deleteAccount(account.id);
		
				assert.deepEqual(schemas.Account(accountRetrive.avatarHash), getResult(accountRetrive));
			});
		});

		describe('Project Testing', () => {
			it('Create project', async () => {
				const project = await store.createProject({
					name: 'project 1', ownerId: 'user1', language: 'java', abstract: ''
				});
	
				assert.deepEqual(schemas.Project(), getResult(project));
			});
	
			it('Query project', async () => {
				const projectList = await store.queryProjectAll();
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => assert.deepEqual(schemas.Project(), getResult(project)));
				} else {
					assert.ok(false, 'return value of queryProjectAll should be an Array.');
				}
			});
	
			it('Query project by owner', async () => {
				const projectList = await store.queryProjectByOwnerId({
					accountId: 1
				});
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => assert.deepEqual(schemas.Project(), getResult(project)));
				} else {
					assert.ok(false, 'return value of queryProjectByOwnerId should be an Array.');
				}
			});
	
			it('Query project by member', async () => {
				const projectList = await store.queryProjectByMember({
					accountId: 1
				});
	
				if (Array.isArray(projectList)) {
					projectList.forEach(project => assert.deepEqual(schemas.Project(), getResult(project)));
				} else {
					assert.ok(false, 'return value of queryProjectByMember should be an Array.');
				}
			});
	
			it('Get project', async () => {
				assert.deepEqual(schemas.Project(), getResult(await store.getProject(project.id)));
			});
	
			it('Update project', async () => {
				assert.deepEqual(schemas.Project(), getResult(await store.updateProject(project.id, {
					name: 'project 1 update'
				})));
			});
	
			it('Delete project', async () => {
				assert.deepEqual(schemas.Project(), getResult(await  store.deleteProject(project.id)));
			});
		});

		describe('Version Testing', () => {
			it('Create version', async () => {
				assert.deepEqual(schemas.Version(), getResult(await store.createVersion({
					semver: '1.0.1', projectId: project.id, abstract: ''
				})));
			});

			it('Query version by projectId', async () => {
				const versionList = await store.queryVersionByProjectId({ projectId: '1' });

				if (Array.isArray(versionList)) {
					versionList.forEach(version => assert.deepEqual(schemas.Version(), getResult(version)));
				} else {
					assert.ok(false, 'return value of queryVersionByProjectId should be an Array.');
				}
			});

			it('Get version', async () => {
				assert.deepEqual(schemas.Version(), getResult(await store.getVersion(version.id)));
			});

			it('Update version', async () => {
				assert.deepEqual(schemas.Version(), getResult(await store.updateVersion(version.id, {
					abstract: 'test'
				})));
			});
		});

		describe('Member Testing', () => {
			let member;

			before(async () => {
				member = await store.createMember({
					projectId: project.id, accountId: account.id, inviter: account.id
				});
			});

			it('Create member', async () => {
				const member = await store.createMember({
					projectId: project.id, accountId: account.id, inviter: account.id
				});

				assert.deepEqual(schemas.Member(), getResult(member));
			});

			it('Query member by projectId', async () => {
				const memberList = await store.queryMemberByProjecyId({project: project.id });

				if (Array.isArray(memberList)) {
					memberList.forEach(member => assert.deepEqual(schemas.Member(member.exitedAt), getResult(member)));
				} else {
					assert.ok(false, 'return value of queryMemberByProjecyId should be an Array.');
				}
			});

			it('Query member by accountId', async () => {
				const memberList = await store.queryMemberByAccountId({account: account.id });

				if (Array.isArray(memberList)) {
					memberList.forEach(member => assert.deepEqual(schemas.Member(member.exitedAt), getResult(member)));
				} else {
					assert.ok(false, 'return value of queryMemberByAccountId should be an Array.');
				}
			});

			it('Get member', async () => {
				const memberRetrive = await store.getMember(member.id);

				assert.deepEqual(schemas.Member(memberRetrive.exitedAt), getResult(memberRetrive));
			});

			it('Update member', async () => {
				const memberRetrive = await store.updateMember(member.id);

				assert.deepEqual(schemas.Member(memberRetrive.exitedAt), getResult(memberRetrive));
			});
		});

		describe('Flow Testing', () => {
			it('Create flow', async () => {
				const flow = await store.createFlow({
					parentId: null, name: 'flow1', projectId: project.id,
					stageList: [],  evolution: [[]]
				});

				assert.deepEqual(schemas.Flow(flow.parentId), getResult(flow));
			});

			it('Query flow by projectId', async () => {
				const flowList = await store.queryFlowByProjectId({ projectId: project.id });

				if (Array.isArray(flowList)) {
					flowList.forEach(flow => assert.deepEqual(schemas.Flow(flow.parentId), getResult(flow)));
				} else {
					assert.ok(false, 'return value of queryFlowByProjectId should be an array.');
				}
			});

			it('Get flow', async () => {
				const traceRetrive = await store.getFlow(flow.id);

				assert.deepEqual(schemas.Flow(traceRetrive.parentId), getResult(traceRetrive));
			});
		});

		describe('Trace Testing', () => {
			let trace;

			before(async () => {
				trace = await store.createTrace({
					parentId: null, flowId: flow.id, stageId: 0, versionId: version.id, abstract: ''
				});
			});

			it('Create trace', () => {
				assert.deepEqual(schemas.Trace(trace.parentId), getResult(trace));
			});

			it('Query trace by flowId', async () => {
				const traceList = await store.queryTraceByFlowId({ flowId: flow.id });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => assert.deepEqual(schemas.Trace(trace.parentId), getResult(trace)));
				} else {
					assert.ok(false, 'return value of queryTraceByFlowId should be an array.');
				}
			});

			it('Query trace by stageId', async () => {
				const traceList = await store.queryTraceByStageId({ stageId: 0 });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => assert.deepEqual(schemas.Trace(trace.parentId), getResult(trace)));
				} else {
					assert.ok(false, 'return value of queryTraceByStageId should be an array.');
				}
			});

			it('Query trace by versionId', async () => {
				const traceList = await store.queryTraceByVersionId({ versionId: version.id });

				if (Array.isArray(traceList)) {
					traceList.forEach(trace => assert.deepEqual(schemas.Trace(trace.parentId), getResult(trace)));
				} else {
					assert.ok(false, 'return value of queryTraceByVersionId should be an array.');
				}
			});

			it('Get trace', async () => {
				assert.deepEqual(schemas.Trace(trace.parentId), getResult(await store.getTrace(trace.id)));
			});
		});
	});
};