'use strict';

module.exports = {
	account: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			avatarHash: { type: ['string', 'null'] },
			administrator: { type: 'boolean'},
			createdAt: { format: 'date' }
		}
	},
	project: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			name: { type: 'string' },
			ownerId: { type: 'string' },
			language: { type: 'string' },
			abstract: { type: 'string' },
			createdAt: { format: 'date' }
		}
	},
	version: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			semver: { type: 'string' },
			projectId: { type: 'string' },
			abstract: { type: 'string' },
			createdAt: { format: 'date' }
		}
	},
	member: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			projectId: { type: 'string' },
			accountId: { type: 'string' },
			inviter: { type: 'string' },
			joinedAt: { format: 'date' },
			exitedAt: {
				type: ['object', 'null'],
				format: 'date'
			}
		}
	},
	flow: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			parentId: { type: ['string', 'null'] },
			name: { type: 'string' },
			projectId: { type: 'string' },
			stageList: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						name: { type: 'string' },
						promoted: { type: 'boolean' },
						initializable: { type: 'boolean' },
						plugins: {
							type: 'array',
							items: { type: 'string' }
						}
					}
				}
			},
			evolution: {
				type: 'array',
				items: {
					type: 'array',
					items: { type: 'boolean' }
				}
			},
			createdAt: { format: 'date' }
		}
	},
	trace: {
		type: 'object',
		additionalProperties: false,
		properties: {
			id: { type: 'string' },
			parentId: { type: ['string', 'null'] },
			children: {
				type: 'array',
				items: { type: 'string' }
			},
			projectId: { type: 'string' },
			flowId: { type: 'string' },
			stageId: { type: 'number' },
			versionId: { type: 'string' },
			abstract: { type: 'string' },
			createdAt: { format: 'date' }
		}
	}
};