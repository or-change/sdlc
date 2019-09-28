<template>
	<div>
		<b-form-group :label="$t('track.wrap.evolution.stage')">
			<b-form-select
				v-model="newTrace.stageId"
				:options="evolutionStageSelector"
				size="sm"
			></b-form-select>
		</b-form-group>
		<b-form-group :label="$t('track.wrap.evolution.version')">
			<b-form-select
				v-if="promoted"
				v-model="newTrace.versionId"
				:options="versionSelector"
				size="sm"
			></b-form-select>
			<div v-if="!promoted">{{ $t('track.wrap.evolution.message') }}</div>
		</b-form-group>
		<b-form-group :label="$t('track.wrap.evolution.abstract')">
			<b-form-textarea
				rows="3"
				no-resize
				size="sm"
				v-model='newTrace.abstract'
			></b-form-textarea>
		</b-form-group>
		<b-button class="mt-3" variant="success" block @click="createTrace()">{{ $t('track.wrap.evolution.create') }}</b-button>
		<!-- <b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button> -->
	</div>
</template>

<script>
export default {
	props: {
		evolutionStageSelector: Array,
		versionSelector: Array,
		promoted: Boolean,
		traceList: Array,
		traceActive: String,
		flowSelected: String
	},
	data() {
		return {
			newTrace: {
				parentId: null,
				flowId: '',
				stageId: '',
				versionId: '',
				abstract: ''
			},
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
	},
	methods: {
		async createTrace() {
			this.newTrace.parentId = this.traceActive;
			this.newTrace.flowId = this.flowSelected;

			if (!this.promoted) {
				this.newTrace.versionId = this.traceList.find(trace => trace.id === this.traceActive).versionId;
			}

			try {
				await this.$http.project.trace(this.projectId).create(this.newTrace);
				this.showToast('success', this.$t('track.wrap.evolution.success'));
				this.$emit('queryTraceList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('track.wrap.evolution.failed'));
			}
		},
	}
};
</script>