<template>
	<div>
		<b-form-group :label="$t('track.init.stage')">
			<b-form-select
				v-model="newTrace.stageId"
				:options="initStageSelector"
				size="sm"
			></b-form-select>
		</b-form-group>
		<b-form-group :label="$t('track.init.version')">
			<b-form-select
				v-model="newTrace.versionId"
				:options="versionSelector"
				size="sm"
			></b-form-select>
		</b-form-group>
		<b-form-group :label="$t('track.init.abstract')">
			<b-form-textarea
				rows="3"
				no-resize
				size="sm"
				v-model='newTrace.abstract'
			></b-form-textarea>
		</b-form-group>
		<b-button class="mt-3" variant="success" block @click="traceInit()">{{ $t('track.init.create') }}</b-button>
		<!-- <b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button> -->
	</div>
</template>

<script>
export default {
	props: {
		initStageSelector: Array,
		versionSelector: Array,
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
		async traceInit() {
			this.newTrace.parentId = null;
			this.newTrace.flowId = this.flowSelected;

			try {
				await this.$http.project.trace(this.projectId).create(this.newTrace);
				this.showToast('success', this.$t('track.init.success'));
				this.$emit('queryTraceList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('track.init.failed'));
			}
		},
	}
};
</script>

<style>

</style>