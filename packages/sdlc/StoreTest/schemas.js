'use strict';

module.exports = {
	Account(avatarHash) {
		return {
			id: 'string',
			name: 'string',
			avatarHash: avatarHash ? 'string' : 'object',
			administrator: 'boolean',
			createdAt: 'date'
		};
	},
	Project() {
		return {
			id: 'string',
			name: 'string',
			ownerId: 'string',
			language: 'string',
			abstract: 'string',
			createdAt: 'date'
		};
	},
	Version() {
		return {
			id: 'string',
			semver: 'string',
			projectId: 'string',
			abstract: 'string',
			createdAt: 'date'
		};
	},
	Member(exited) {
		return {
			id: 'string',
			projectId: 'string',
			accountId: 'string',
			inviter: 'string',
			joinedAt: 'date',
			exitedAt: exited ? 'date' : 'object'
		};
	},
	Flow(parentId) {
		return {
			id: 'string',
			parentId: parentId ? 'string' : 'object',
			name: 'string',
			projectId: 'string',
			stageList: 'array',
			evolution: 'array',
			createdAt: 'date'
		};
	},
	Stage() {
		return {
			name: 'string',
			promoted: 'boolean',
			initializable: 'boolean',
			plugins: 'array'
		};
	},
	Trace(parentId) {
		return {
			id: 'string',
			parentId: parentId ? 'string' : 'object',
			flowId: 'string',
			stageId: 'number',
			versionId: 'string',
			abstract: 'string',
			createdAt: 'date'
		};
	}
};