<template>
	<div>
		<b-card v-if="traceActive === null">请选择版本</b-card>
		<b-card
			v-if="traceActive !== null"
			style="min-height:300px;"
		>
			<h5>总结</h5>
			<b-form-textarea
				rows="3" no-resize size="sm"
				readonly class="mb-3"
				v-model="versionDetail.abstract"
			></b-form-textarea>
			<b-button
				size="sm"
				variant="primary"
				@click="showModal('evolution-modal')"
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
			<!-- <b-tabs card>
				<b-tab title="工具1">
					2
				</b-tab>
				<b-tab title="工具2">
					3
				</b-tab>
			</b-tabs> -->
		</b-card>

		<b-modal ref="evolution-modal" hide-footer scrollable title="演进">
			<TraceEvolution
				:traceList="traceList"
				:traceActive="traceActive"
				:flowSelected="flowSelected"
				:versionSelector="versionSelector"
				:promoted="versionDetail.promoted"
				:evolutionStageSelector="evolutionStageSelector"
				@queryTraceList="queryTraceList"
			></TraceEvolution>
		</b-modal>
	</div>
</template>

<script>
import TraceEvolution from './TraceEvolution';

export default {
	props: {
		traceActive: String,
		traceList: Array,
		flowList: Array,
		flowSelected: String,
		versionSelector: Array,
		trackStageList: Array
	},
	components: {
		TraceEvolution
	},
	data() {
		return {
			evolutionStageSelector: [],
			versionDetail: {
				promoted: true,
				abstract: ''
			}
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
	},
	watch: {
		traceActive(val) {
			if (val !== null) {
				const activeTrace = this.traceList.find(trace => trace.id === this.traceActive);
				const selectedFlow = this.flowList.find(flow => flow.id === this.flowSelected);

				this.evolutionStageSelector = selectedFlow.evolution[activeTrace.stageId]
					.map((evo, index) => {
						if (evo) {
							return {
								value: index,
								text: this.trackStageList[index]
							};
						} else {
							return null;
						}
					}).filter(evo => evo !== null);

				this.versionDetail.promoted = selectedFlow.stageList[activeTrace.stageId].promoted;
				this.versionDetail.abstract = activeTrace.abstract;
			}
		}
	},
	methods: {
		queryTraceList() {
			this.$emit('queryTraceList');
		},
		
		showModal(modalId) {
			this.$refs[modalId].show();
		}
	}
};
</script>

<style>

</style>