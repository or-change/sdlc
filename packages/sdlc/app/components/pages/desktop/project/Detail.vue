<template>
	<div>
		<b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item to="/desktop/project">我的项目</b-breadcrumb-item>
			<b-breadcrumb-item active></b-breadcrumb-item>
		</b-breadcrumb>

		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">项目属性</h4>
		<b-row>
			<b-col>
				<b-form-group label="项目名称:">
					<b-form-input trim size="sm" v-model="project.name"></b-form-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group label="开发语言:">
					<b-form-input v-model="project.language" size="sm"></b-form-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group label="负责人:">
					<b-form-input
						v-if="accountList.length !== 0 && project.owner.length !== 0"
						readonly
						size="sm"
						:value="accountList.find(account => account.id === project.owner).name "
					></b-form-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group label="创建时间:">
					<b-form-input :value="project.createdAt | dateFormat" size="sm" readonly></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-form-group label="项目简介:">
					<b-form-textarea
						rows="3"
						no-resize
						size="sm"
						v-model="project.abstract"
					></b-form-textarea>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row class="mb-3">
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="success"
					@click="updateProject"
					:disabled="!projectNameState || !projectLanguageState || !projectAbstractState"
				><i
					class="fas fa-check mr-2"
				/>更新项目属性</b-button>
			</b-col>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="danger"
					@click="deleteProject"
				><i
					class="fas fa-times mr-2"
				/>删除此项目</b-button>
			</b-col>
		</b-row>


		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">项目成员</h4>
		<custom-project-member
			:projectId="projectId"
			:projectOwner="project.owner"
			class="mb-3"
		></custom-project-member>

		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">版本信息</h4>
		<custom-project-version
			:projectId="projectId"
			class="mb-3"
		></custom-project-version>

		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">阶段追踪</h4>
		<b-row class="mb-3">
			<b-col cols="3">
				<b-form-select
					v-model="flowSelected"
					:options="flowSelector"
					size="sm"
				></b-form-select>
			</b-col>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="info"
					@click="showCreateFlowModal()"
				><i
					class="fas fa-plus mr-2"
				/>添加新流程</b-button>
			</b-col>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="primary"
					@click="showInitFlowModal()"
				><i
					class="fas fa-plus mr-2"
				/>初始化</b-button>
			</b-col>
		</b-row>
		<b-row v-if="flowList.length !== 0">
			<b-col cols="6">
				<stage-track-wrap
					:traceData="trackTraceList"
					:stageList="trackStageList"
					:versionList="versionList"
					:active.sync="traceActive"
					:traceChanger.sync="traceChanger"
				></stage-track-wrap>
			</b-col>
			<b-col cols="6">
				<stage-track-tree
					:traceData="trackTraceList"
					:versionList="versionList"
					:active.sync="traceActive"
					:traceChanger.sync="traceChanger"
				></stage-track-tree>
			</b-col>
		</b-row>

		<b-modal ref="create-flow-modal" hide-footer scrollable title="创建新流程">
			<div>
				<b-form-group label="流程名称:">
					<b-form-input size="sm" v-model="newFlow.name"></b-form-input>
				</b-form-group>
				<b-form-group label="父级流程:">
					<b-form-select
						v-if="flowSelector.length !== 0"
						v-model="newFlow.parentId"
						:options="flowSelector"
						size="sm"
					></b-form-select>
					<div v-if="flowSelector.length === 0">无</div>
				</b-form-group>
				<b-form-group label="阶段:">
					<div v-if="newFlow.stageList.length !== 0">
						<b-card
							v-for="(stage, index) in newFlow.stageList"
							:key="index"
							class="mb-3"
						>
							<b-form-group label-size="sm" :label="`${index + 1} 阶段名称:`">
								<b-form-input size="sm" v-model="stage.name"></b-form-input>
							</b-form-group>

							<b-form-group label-size="sm" label="配置:">
								<b-form-checkbox switch v-model="stage.promoted">版本是否可提升</b-form-checkbox>
								<b-form-checkbox switch v-model="stage.initializable">是否可初始化</b-form-checkbox>
							</b-form-group>

							<b-form-group label-size="sm" label="可用工具:">
								<!-- <b-form-checkbox-group
									v-model="stage.plugins"
									:options="pluginList"
									size="sm"
								></b-form-checkbox-group> -->
							</b-form-group>

							<b-button
								class="w-100"
								size="sm"
								variant="danger"
								@click="removeStage(index)"
							><i
								class="fas fa-times mr-2"
							/>删除此阶段</b-button>
						</b-card>
					</div>
					<div v-if="newFlow.stageList.length === 0">请添加阶段</div>
					<b-button
						class="w-100"
						size="sm"
						variant="primary"
						@click="addStage()"
					><i
						class="fas fa-plus mr-2"
					/>添加阶段</b-button>
				</b-form-group>

				<b-form-group label="阶段可演进关系:">
					<b-table
						v-if="newFlow.stageList.length !== 0"
						small
						:fields="evolutionTable.fields"
						:items="evolutionTable.items"
						class="text-center"
					>
						<template
							v-for="(field, index) in evolutionTable.items"
							:slot="field.index"
							slot-scope="data"
						>
							<b-form-checkbox
								v-if="newFlow.evolution.length !== 0"
								switch
								:key="index"
								v-model="newFlow.evolution[data.index][index]"
							>
							</b-form-checkbox>
						</template>
					</b-table>
					<div v-if="newFlow.stageList.length === 0">请添加阶段</div>
				</b-form-group>
			</div>
			<b-button class="mt-3" variant="success" block @click="createFlow()">确认创建此流程</b-button>
			<b-button class="mt-2" variant="warning" block @click="hideCreateFlowModal()">关闭并清除填入信息</b-button>
		</b-modal>

		<b-modal ref="init-flow-modal" hide-footer scrollable title="初始化">
			<div>
				<b-form-group label="选择阶段:">
					<b-form-select
					v-model="newTrace.stageId"
					:options="initStageSelector"
					size="sm"
				></b-form-select>
				</b-form-group>
				<b-form-group label="选择版本:">
					<b-form-select
					v-model="newTrace.versionId"
					:options="versionSelector"
					size="sm"
				></b-form-select>
				</b-form-group>
				<b-form-group label="简介:">
					<b-form-textarea
						rows="3"
						no-resize
						size="sm"
						v-model='newTrace.abstract'
					></b-form-textarea>
				</b-form-group>
			</div>
			<b-button class="mt-3" variant="success" block @click="createTrace('init')">确认初始化</b-button>
			<b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button>
		</b-modal>

		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">版本详情</h4>
		<b-card v-if="traceActive === null">请选择版本</b-card>
		<b-card
			v-if="traceActive !== null"
			style="min-height:300px;"
		>
			<h5>总结</h5>
			<b-form-textarea
				rows="3"
				no-resize
				size="sm"
				v-model="versionDetail.abstract"
				readonly
				class="mb-3"
			></b-form-textarea>
			<b-button
				size="sm"
				variant="primary"
				@click="showEvolutionModal()"
			><i
				class="fas fa-plus mr-2"
			/>演进</b-button>
			<!-- <b-button
				size="sm"
				variant="info"
			><i
				class="fas fa-step-backward mr-2"
			/>回滚</b-button> -->

			<h5 class="pt-3 pb-2">资源</h5>
			<b-tabs card>
				<b-tab title="工具1">
					2
				</b-tab>
				<b-tab title="工具2">
					3
				</b-tab>
			</b-tabs>
		</b-card>

		<b-modal ref="evolution-modal" hide-footer scrollable title="演进">
			<div>
				<b-form-group label="阶段演进至:">
					<b-form-select
						v-model="newTrace.stageId"
						:options="evolutionStageSelector"
						size="sm"
					></b-form-select>
				</b-form-group>
				<b-form-group label="选择版本:">
					<b-form-select
						v-if="versionDetail.initializable"
						v-model="newTrace.versionId"
						:options="versionSelector"
						size="sm"
					></b-form-select>
					<div v-if="!versionDetail.initializable">此阶段不可提升版本</div>
				</b-form-group>
				<b-form-group label="简介:">
					<b-form-textarea
						rows="3"
						no-resize
						size="sm"
						v-model='newTrace.abstract'
					></b-form-textarea>
				</b-form-group>
			</div>
			<b-button class="mt-3" variant="success" block @click="createTrace('evolution')">确认演进</b-button>
			<b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button>
		</b-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			project: {
				name: '',
				owner: '',
				language: '',
				abstract: '',
				createdAt: null
			},
			accountList: [],
			versionList: [],
			versionSelector: [],
			initStageSelector: [],
			evolutionStageSelector: [],
			flowList: [],
			traceList: [],
			trackStageList: [],
			trackTraceList: [],
			flowSelected: '',
			flowSelector: [],
			newFlow: {
				name: '',
				parentId: null,
				stageList: [],
				evolution: []
			},
			evolutionTable: {},
			newTrace: {
				parentId: null,
				flowId: '',
				stageId: '',
				versionId: '',
				abstract: ''
			},
			versionDetail: {
				initializable: true,
				abstract: ''
			},

			traceActive: null,
			traceChanger: '',
		}
	},
	computed: {
		accountId() {
			return this.$store.state.principal.id;
		},
		projectId() {
			return this.$route.params.projectId;
		},
		projectNameState() {
			return this.project.name.length > 0;
		},
		projectLanguageState() {
			return this.project.language.length > 0;
		},
		projectAbstractState() {
			return this.project.abstract.length > 0;
		}
	},
	watch: {
		'newFlow.stageList'() {
			this.newFlow.evolution = this.newFlow.stageList.map(() => {
				return this.newFlow.stageList.map(() => {
					return true;
				});
			});

			const evolutionTable = {
				fields: [
					{ key: 'index', label: '' }
				],
				items: []
			};
			this.newFlow.stageList. forEach((stage, index) => {
				evolutionTable.fields.push({ key: String(index + 1), value: String(index + 1) });
				evolutionTable.items.push({ index: String(index + 1) });
			});

			this.evolutionTable = evolutionTable;
		},
		flowSelected() {
			this.trackStageList = this.flowList.find(flow => flow.id === this.flowSelected).stageList
				.map(stage => stage.name);
			this.trackTraceList = this.traceList.filter(trace => trace.flowId === this.flowSelected)
				.map(trace => {
					return {
						hash: trace.id,
						parent: trace.parentId,
						flow: trace.flowId,
						stage: this.trackStageList[trace.stageId],
						version: trace.versionId,
						date: trace.createdAt
					}
				})
			this.initStageSelector = this.flowList.find(flow => flow.id === this.flowSelected).stageList
				.map((stage, index) => {
					if (stage.initializable) {
						return {
							value: index,
							text: stage.name
						}
					} else {
						return null
					}
				}).filter(stage => stage !== null);
			this.traceActive = null;
		},
		traceActive(val) {
			if (val !== null) {
				const activeTrace = this.traceList.find(trace => trace.id === this.traceActive);

				this.evolutionStageSelector = this.flowList.find(flow => flow.id === this.flowSelected)
					.evolution[activeTrace.stageId]
					.map((evo, index) => {
						if (evo) {
							return {
								value: index,
								text: this.trackStageList[index]
							}
						} else {
							return null
						}
					})
					.filter(evo => evo !== null);

				this.versionDetail.initializable = this.flowList.find(flow => flow.id === this.flowSelected)
					.stageList[activeTrace.stageId].initializable;
				this.versionDetail.abstract = activeTrace.abstract;
			}
		}
	},
	mounted() {
		this.getProjectById();
		this.queryAccountList();
		this.queryVersionList();
		this.queryFlowList();
		this.queryTraceList();
	},
	methods: {
		async getProjectById() {
			const project = await this.$http.project.get(this.projectId);

			this.project.name = project.name;
			this.project.owner = project.ownerId;
			this.project.language = project.language;
			this.project.abstract = project.abstract;
			this.project.createdAt = project.createdAt;
			// console.log(project);
		},
		async updateProject() {
			try {
				await this.$http.project.update(this.projectId, {
					name: this.project.name,
					language: this.project.language,
					abstract: this.project.abstract
				});
				this.showToast('success', '更新成功');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '更新失败');
			}
		},
		async deleteProject() {
			await this.$http.project.delete(this.projectId);
			this.$router.push('/desktop/project');
		},
		async queryAccountList() {
			this.accountList = await this.$http.account.query();
		},
		async queryVersionList() {
			const versionList = await this.$http.project.version(this.projectId).query();
			this.versionList = versionList;
			this.versionSelector = versionList.map(version => {
				return {
					value: version.id,
					text: version.semver
				}
			})
		},
		async queryFlowList() {
			const flowList = await this.$http.project.flow(this.projectId).query();

			this.flowList = flowList;

			if (flowList.length !== 0) {
				this.trackStageList = flowList[0].stageList.map(stage => stage.name);
				this.initStageSelector = flowList[0].stageList.map((stage, index) => {
					if (stage.initializable) {
						return {
							value: index,
							text: stage.name
						}
					} else {
						return null
					}
				}).filter(stage => stage !== null);
				this.flowSelected = flowList[0].id;
				this.flowSelector = flowList.map(flow => {
					return {
						value: flow.id,
						text: flow.name
					}
				})
			}
			// console.log(flowList);
		},
		async createTrace(style) {
			try {
				if (style === 'init') {
					this.newTrace.parentId = null;
				}

				if (style === 'evolution') {
					this.newTrace.parentId = this.traceActive;
				}
				this.newTrace.flowId = this.flowSelected;

				await this.$http.project.trace(this.projectId).create(this.newTrace);
				this.showToast('success', '创建成功');
				this.queryTraceList();
				this.hideInitFlowModal();
				this.hideEvolutionModal();
			} catch (error) {
				console.log(error);
				this.showToast('danger', '创建失败');
			}
		},
		async queryTraceList() {
			const traceList = await this.$http.project.trace(this.projectId).query();

			this.traceList = traceList;
			if (this.flowSelected.length !== 0) {
				this.trackTraceList = traceList.filter(trace => trace.flowId === this.flowSelected)
					.map(trace => {
						return {
							hash: trace.id,
							parent: trace.parentId,
							flow: trace.flowId,
							stage: this.trackStageList[trace.stageId],
							version: trace.versionId,
							date: trace.createdAt
						}
					});
			}

			// console.log(this.trackTraceList);
			// console.log(traceList);
		},
		// recleanTrackData() {

		// },
		addStage() {
			this.newFlow.stageList.push({
				name: '',
				promoted: true,
				initializable: true,
				plugins: []
			});
		},
		removeStage(stageIndex) {
			this.newFlow.stageList.splice(stageIndex, 1);
		},
		async createFlow() {
			if (this.flowSelector.length === 0) {
				this.newFlow.parentId = null;
			}
			
			try {
				await this.$http.project.flow(this.projectId).create(this.newFlow);
				this.showToast('success', '添加成功');
				this.queryFlowList();
				this.hideCreateFlowModal();
			} catch (error) {
				console.log(error);
				this.showToast('danger', '添加失败');
			}
		},
		showCreateFlowModal() {
			this.$refs['create-flow-modal'].show();
		},
		hideCreateFlowModal() {
			this.newFlow = {
				name: '',
				stageList: [],
				evolution: []
			};
			this.evolutionTable = {};
			this.$refs['create-flow-modal'].hide();
		},
		showInitFlowModal() {
			this.$refs['init-flow-modal'].show();
		},
		hideInitFlowModal() {
			this.$refs['init-flow-modal'].hide();
			this.newTrace = {
				parentId: null,
				flowId: '',
				stageId: '',
				versionId: '',
				abstract: ''
			}
		},
		showEvolutionModal() {
			this.$refs['evolution-modal'].show();
		},
		hideEvolutionModal() {
			this.$refs['evolution-modal'].hide();
			this.newTrace = {
				parentId: null,
				flowId: '',
				stageId: '',
				versionId: '',
				abstract: ''
			}
		}
	}
}
</script>

<style>

</style>