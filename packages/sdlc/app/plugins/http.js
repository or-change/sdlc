import axios from 'axios';

export default function install(Vue) {
	const agent = axios.create({
		baseURL: '/api'
	});

	Vue.prototype.$http = {
		product: {
			async get() {
				const { data: product } = await agent.get('/product');

				return product;
			}
		},
		principal: {
			async signin(credential) {
				const { type, body } = credential;

				const { data: principal } = await agent.post('/session/principal', body, {
					params: { type }
				});

				return principal;
			},
			async signout() {
				await agent.delete('/session/principal');
			},
			async get() {
				const { data: principal } = await agent.get('/principal');

				return principal;
			},
			async update(payload) {
				const { data: principal } = await agent.put('/principal', payload);

				return principal;
			}
		},
		admin: {

		},
		account: {
			async query(payload) {
				const { data: accountList } = await agent.get('/account', {
					params: payload
				});

				return accountList.map(account => {
					return {
						id: account.id,
						name: account.name,
						administrator: account.administrator
					};
				});
			},
			async update(accountId, payload) {
				return await agent.put(`/account/${accountId}`, payload);
			},
			// async get(accountId) {
			// 	const { data: account } = await agent.get(`/account/${accountId}`);

			// 	return {
			// 		id: account.id,
			// 		name: account.name,
			// 		email: account.email,
			// 		avatar: account.avatar,
			// 		administrator: account.administrator
			// 	};
			// }
		},
		project: {
			async create(project) {
				const { data: result } = await agent.post('/project', project);

				return {
					id: result.id,
					name: result.name,
					ownerId: result.ownerId,
					createdAt: new Date(result.createdAt)
				};
			},
			async update(projectId, payload) {
				return await agent.put(`/project/${projectId}`, payload);
			},
			async delete(projectId) {
				return await agent.delete(`/project/${projectId}`);
			},
			async query() {
				const { data: projectList} = await agent.get('/project');
				
				return projectList.map(project => {
					return {
						id: project.id,
						name: project.name,
						ownerId: project.ownerId,
						language: project.language,
						createdAt: new Date(project.createdAt)
					};
				});
			},
			async get(projectId) {
				const { data: project} = await agent.get(`/project/${projectId}`);

				return {
					id: project.id,
					name: project.name,
					ownerId: project.ownerId,
					language: project.language,
					abstract: project.abstract,
					createdAt: new Date(project.createdAt)
				};
			},
			version(projectId) {
				return {
					async create(payload) {
						const {data: version} = await agent.post(`/project/${projectId}/version`, payload);
					},
					async query(filter) {
						const { data: versionList} = await agent.get(`/project/${projectId}/version`, {
							params: filter
						});

						return versionList;
					},
					async get(versionId) {
						const { data: version} = await agent.get(`/project/${projectId}/version/${versionId}`);
					},
					async update(versionId, payload) {
						const { data: version} = await agent.put(`/project/${projectId}/version/${versionId}`, payload);
					}
				};
			},
			member(projectId) {
				return {
					async create(payload) {
						const {data: member} = await agent.post(`/project/${projectId}/member`, payload);

						return {
							id: member.id,
							projectId: member.projectId,
							accountId: member.accountId,
							inviter: member.inviter,
							joinedAt: new Date(member.joinedAt),
							exitedAt: new Date(member.exitedAt)
						};
					},
					async query(filter) {
						const { data: memberList} = await agent.get(`/project/${projectId}/member`, {
							params: filter
						});

						return memberList.map(member => {
							return {
								id: member.id,
								projectId: member.projectId,
								accountId: member.accountId,
								inviter: member.inviter,
								joinedAt: new Date(member.joinedAt),
								exitedAt: new Date(member.exitedAt)
							};
						});
					},
					async get(memberId) {
						const { data: member} = await agent.get(`/project/${projectId}/member/${memberId}`);
					
						return {
							id: member.id,
							projectId: member.projectId,
							accountId: member.accountId,
							inviter: member.inviter,
							joinedAt: new Date(member.joinedAt),
							exitedAt: new Date(member.exitedAt),
						};
					},
					async delete(memberId) {
						return await agent.delete(`/project/${projectId}/member/${memberId}`);
					}
				};
			},
			flow(projectId) {
				return {
					async create(payload) {
						const {data: flow} = await agent.post(`/project/${projectId}/flow`, payload);
					},
					async query(filter) {
						const { data: flowList} = await agent.get(`/project/${projectId}/flow`, {
							params: filter
						});

						return flowList;
					},
					async get(flowId) {
						const { data: flow} = await agent.get(`/project/${projectId}/flow/${flowId}`);
					}
				};
			},
			trace(projectId) {
				return {
					async create(payload) {
						const {data: trace} = await agent.post(`/project/${projectId}/trace`, payload);
					},
					async query(filter) {
						const { data: traceList} = await agent.get(`/project/${projectId}/trace`, {
							params: filter
						});

						return traceList;
					},
					async get(traceId) {
						const { data: trace} = await agent.get(`/project/${projectId}/trace/${traceId}`);
					}
				};
			}
		}
	};
}