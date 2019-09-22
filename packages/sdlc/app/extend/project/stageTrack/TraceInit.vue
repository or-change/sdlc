<template>
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
		<b-button class="mt-3" variant="success" block @click="traceInit()">确认初始化</b-button>
		<!-- <b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button> -->
	</div>
</template>

<script>
export default {
	props: {
		projectId: String,
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
	watch: {

	},
	methods: {
		async traceInit() {
			this.newTrace.parentId = null;
			this.newTrace.flowId = this.flowSelected;

			try {
				await this.$http.project.trace(this.projectId).create(this.newTrace);
				this.showToast('success', '创建成功');
				this.$emit('queryTraceList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '创建失败');
			}
		},
	}
};
</script>

<style>

</style>