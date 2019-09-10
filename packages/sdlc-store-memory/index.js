'use strict';

const store = {
	account: require('./store/account.json'),
	project: require('./store/project.json'),
	version: require('./store/version.json'),
	member: require('./store/member.json'),
	flow: require('./store/flow.json'),
	stage: require('./store/stage.json'),
	trace: require('./store/trace.json')
};

function filterDate(arr) {
	return arr.map(item => {
		item.createdAt = new Date(item.createdAt);

		return item;
	});
}

module.exports = function (data = {
	account: filterDate(store.account),
	project: filterDate(store.project),
	version: filterDate(store.version),
	member: filterDate(store.member),
	flow: filterDate(store.flow),
	stage: filterDate(store.stage),
	trace: filterDate(store.trace),
}) {
	const store = {
		createAccount({
			name, administrator, avatarHash
		}) {
			const account = {
				id: Math.random().toString(16).substr(2, 8),
				name, administrator, avatarHash,
				createdAt: new Date()
			};

			data.account.push(account);

			return account;
		},
		queryAccountAll() {
			return data.account;
		},
		queryAccountByName({ name }) {
			return data.account.filter(account => new RegExp(name).test(account.name));
		},
		getAccount(accountId) {
			return data.account.find(account => account.id === accountId) || null;
		},
		updateAccount(accountId, items) {
			const account = data.account.find(account => account.id === accountId);

			for (const key in account) {
				if (items[key] !== undefined) {
					account[key] = items[key];
				}
			}

			return account;
		},
		deleteAccount(accountId) {
			const index = data.account.findIndex(account => account.id === accountId);

			return data.account.splice(index, 1)[0];
		},
		createProject({
			name, ownerId, language, abstract
		}) {
			const project = {
				id: Math.random().toString(16).substr(2, 8),
				name, ownerId, language, abstract,
				createdAt: new Date()
			};

			data.project.push(project);

			return project;
		},
		queryProjectAll() {
			return data.project;
		},
		queryProjectByOwnerId({ accountId }) {
			return data.project.filter(project => project.ownerId === accountId);
		},
		queryProjectByMember({ accountId }) {
			const memberList = store.queryMemberByAccountId({
				accountId
			});

			return data.project.filter(project => {
				return project.ownerId === accountId || 
					memberList.find(member => member.projectId === project.id);
			});
		},
		getProject(projectId) {
			return data.project.find(project => project.id === projectId) || null;
		},
		updateProject(projectId, items) {
			const project = data.project.find(project => project.id === projectId);

			for (const key in project) {
				if (items[key] !== undefined) {
					project[key] = items[key];
				}
			}

			return project;
		},
		deleteProject(projectId) {
			const index = data.project.findIndex(project => project.id === projectId);

			return data.project.splice(index, 1)[0];
		},
		createMember({
			projectId, accountId,inviter
		}) {
			const member = {
				id: Math.random().toString(16).substr(2, 8),
				projectId, accountId, inviter,
				joinedAt: new Date(),
				exitedAt: null
			};

			data.member.push(member);

			return member;
		},
		queryMemberByProjecyId({ projectId, excludeExited = true }) {
			return data.member.filter(member => {
				if (excludeExited) {
					return member.projectId === projectId && !member.exitedAt;
				}

				return member.projectId === projectId;
			});
		},
		queryMemberByAccountId({ accountId, excludeExited = true }) {
			return data.member.filter(member => {
				if (excludeExited) {
					return member.accountId === accountId && !member.exitedAt;
				}

				return member.accountId === accountId;
			});
		},
		getMember(memberId) {
			return data.member.find(member => member.id === memberId) || null;
		},
		updateMember(memberId) {
			const member = data.member.find(member => member.id === memberId);

			member.exitedAt = new Date();
			return member;
		},
		createVersion({
			semver, projectId, abstract
		}) {
			const version = {
				id: Math.random().toString(16).substr(2, 8),
				projectId, semver, abstract,
				createdAt: new Date()
			};

			data.version.push(version);

			return version;
		},
		queryVersionByProjectId({ projectId }) {
			return data.version.filter(version => version.projectId === projectId);
		},
		getVersion(versionId) {
			return data.version.find(version => version.id === versionId) || null;
		},
		updateVersion(versionId, items) {
			const version = data.version.find(version => version.id === versionId);

			for (const key in version) {
				if (items[key] !== undefined) {
					version[key] = items[key];
				}
			}

			return version;
		},
		createFlow({
			parentId, name, projectId, stageList, evolution
		}) {
			const flowId = Math.random().toString(16).substr(2, 8);

			const flow = {
				id: flowId,
				parentId, name, projectId, evolution,
				createdAt: new Date()
			};
			data.flow.push(flow);

			stageList.forEach((stage, index) => {
				data.stage.push(Object.assign({}, stage, {
					id: Math.random().toString(16).substr(2, 8),
					index, flowId,createdAt: new Date()
				}));
			});

			return Object.assign({}, flow, { stageList: stageList });
		},
		queryFlowByProjectId({ projectId }) {
			return data.flow.filter(flow => flow.project === projectId)
				.map(flow => {
					const stageList = data.stage.filter(stage => stage.flowId === flow.id)
						.sort((a, b) => { return a.index- b.index; })
						.map(stage => {
							const result = Object.assign({}, stage);

							delete result.id;
							delete result.createdAt;
							delete result.index;
							delete result.flowId;

							return result;
						});

					flow.stageList = stageList;

					return flow;
				});
		},
		getFlow(flowId) {
			const flow = data.flow.find(flow => flow.id === flowId) || null;

			const stageList = data.stage.filter(stage => stage.flowId === flow.id)
				.sort((a, b) => { return a.index- b.index; })
				.map(stage => {
					const result = Object.assign({}, stage);

					delete result.id;
					delete result.createdAt;
					delete result.index;
					delete result.flowId;

					return result;
				});

			flow.stageList = stageList;

			return flow;
		},
		createTrace({
			parentId, flowId, stageId, versionId, abstract
		}) {
			const trace = {
				id: Math.random().toString(16).substr(2, 8),
				parentId, flowId, stageId, versionId, abstract,
				createdAt: new Date()
			};

			data.trace.push(trace);

			return trace;
		},
		queryTraceByFlowId({ flowId }) {
			return data.trace.filter(trace => trace.flowId === flowId);
		},
		queryTraceByStageId({ stageId }) {
			return data.trace.filter(trace => trace.stageId === stageId);
		},
		queryTraceByVersionId({ versionId }) {
			return data.trace.filter(trace => trace.versionId === versionId);
		},
		getTrace(traceId) {
			return data.trace.find(trace => trace.id === traceId) || null;
		}
	};

	return store;
};