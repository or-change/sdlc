<template>
  <div>
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
					@click="showModal('create-flow-modal')"
				><i
					class="fas fa-plus mr-2"
				/>添加新流程</b-button>
			</b-col>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="primary"
					@click="showModal('init-flow-modal')"
				><i
					class="fas fa-plus mr-2"
				/>初始化</b-button>
			</b-col>
		</b-row>
		<b-row v-if="flowList.length !== 0">
			<b-col cols="6">
				<stageTrackWrap
					:traceData="trackTraceList"
					:stageList="trackStageList"
					:versionList="versionList"
					:active.sync="traceActive"
					:traceChanger.sync="traceChanger"
				></stageTrackWrap>
			</b-col>
			<b-col cols="6" v-if="trackTraceList.length !== 0">
				<stageTrackTree
					:flowList="flowList"
					:versionList="versionList"
					:active.sync="traceActive"
					:traceData="trackTraceList"
					:traceChanger.sync="traceChanger"
				></stageTrackTree>
			</b-col>
		</b-row>

		<h4 class="mb-3" style="font-weight:bold;color:#6772e5;">详情</h4>
		<TraceDetail
			:flowList="flowList"
			:projectId="projectId"
			:traceList="traceList"
			:traceActive="traceActive"
			:flowSelected="flowSelected"
			:trackStageList="trackStageList"
			:versionSelector="versionSelector"
			@queryTraceList="queryTraceList"
		></TraceDetail>

		<b-modal ref="create-flow-modal" hide-footer scrollable title="创建新流程">
			<FlowCreate
				:projectId="projectId"
				:flowSelector="flowSelector"
				@queryFlowList="queryFlowList"
			></FlowCreate>
		</b-modal>

		<b-modal ref="init-flow-modal" hide-footer scrollable title="初始化">
			<TraceInit
				:projectId="projectId"
				:flowSelected="flowSelected"
				:versionSelector="versionSelector"
				:initStageSelector="initStageSelector"
				@queryTraceList="queryTraceList"
			></TraceInit>
		</b-modal>

  </div>
</template>

<script>
import './wrap.scss';
import './tree.scss';

import StageTrackWrap from './Wrap';
import StageTrackTree from './Tree';
import FlowCreate from './FlowCreate';
import TraceInit from './TraceInit';
import TraceDetail from './TraceDetail';

export default {
  props: {
		projectId: String,
		versionList: Array
	},
	components: {
		StageTrackWrap,
		StageTrackTree,
		FlowCreate,
		TraceInit,
		TraceDetail
	},
  data() {
    return {
			flowList: [],
			traceList: [],
			trackStageList: [],
			trackTraceList: [],

			versionSelector: [],
			initStageSelector: [],
			flowSelector: [],
			flowSelected: '',

			traceActive: null,
			traceChanger: '',
    }
  },
  watch: {
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
		versionList() {
			this.versionSelector = this.versionList.map(version => {
				return {
					value: version.id,
					text: version.semver
				}
			})
		}
  },
  mounted() {
		this.queryFlowList();
		this.queryTraceList();
  },
  methods: {
		async queryFlowList() {
			const flowList = await this.$http.project.flow(this.projectId).query();
			this.flowList = flowList;

			if (flowList.length !== 0) {
				this.flowSelected = flowList[0].id;
				this.trackStageList = flowList[0].stageList.map(stage => stage.name);
				this.initStageSelector = flowList[0].stageList.map((stage, index) => {
					if (stage.initializable) {
						return { value: index, text: stage.name }
					} else {
						return null
					}
				}).filter(stage => stage !== null);
				this.flowSelector = flowList.map(flow => {
					return { value: flow.id, text: flow.name }
				})
			}
			// console.log(flowList);
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
			// console.log(traceList);
		},
		showModal(modalId) {
			this.$refs[modalId].show();
		}
  }
}
</script>