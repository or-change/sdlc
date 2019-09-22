<template>
	<div>
		<b-form-group label="版本号: (格式: 1.0.0)">
			<b-form-input 
				size="sm" 
				v-model="newVersion.semver" 
				:state="semverState"
			></b-form-input>
			</b-form-group>
			<b-form-group label="版本简介:">
				<b-form-textarea 
					rows="3"
					no-resize
					size="sm" 
					v-model='newVersion.abstract'
					:state="abstractStage"
				></b-form-textarea>
			</b-form-group>
		<b-button 
			class="mt-3" 
			variant="primary" 
			block 
			@click="createVersion" 
			:disabled="!semverState || !abstractStage"
		>确认创建版本</b-button>
		<!-- <b-button 
			class="mt-2" 
			variant="warning" 
			block 
			@click="hideCreateVersionModal()"
		>关闭并清除填入信息</b-button> -->
	</div>
</template>

<script>
export default {
	props: {
		projectId: String
	},
	data() {
		return {
			newVersion: {
				semver: '',
				abstract: ''
			}
		};
	},
	computed: {
		semverState() {
			return this.newVersion.semver.length > 0;
		},
		abstractStage() {
			return this.newVersion.abstract.length > 0;
		}
	},
	methods: {
		async createVersion() {
			try {
				await this.$http.project.version(this.projectId).create(this.newVersion);
				this.showToast('success', '添加成功');
				this.$emit('queryVersionList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '添加失败');
			}
		}
	}
};
</script>

<style>

</style>