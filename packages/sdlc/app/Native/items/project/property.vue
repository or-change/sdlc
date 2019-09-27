<template>
	<div>
		<h4 class="mb-3">基本属性</h4>
		<b-row>
			<b-col cols="3">
				<b-form-group label="项目名称:">
					<b-form-input trim size="sm" v-model="project.name"></b-form-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group label="项目简介:">
					<b-form-input
						size="sm"
						v-model="project.abstract"
					></b-form-input>
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
					:disabled="!projectNameState || !projectAbstractState"
				><i
					class="fas fa-check mr-2"
				/>更新项目属性</b-button>
			</b-col>
		</b-row>

		<h4 class="mt-4 mb-3">项目成员</h4>
		<projectMember></projectMember>

		<h4 class="mt-4 mb-3">版本信息</h4>
		<projectVersion 
			:versionList="versionList"
			@queryVersionList="queryVersionList"
		></projectVersion>

		<h4 class="mt-4 mb-3">阶段追踪</h4>
		<stageTrack
			:versionList="versionList"
		></stageTrack>

	</div>
</template>

<script>
import projectMember from './Member';
import projectVersion from './Version';
import stageTrack from './stageTrack/StageTrack';

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
			versionList: []
		};
	},
	components: {
		projectMember,
		projectVersion,
		stageTrack
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		projectNameState() {
			return this.project.name.length > 0;
		},
		projectAbstractState() {
			return this.project.abstract.length > 0;
		}
	},
	mounted() {
		this.getProjectById();
		this.queryAccountList();
		this.queryVersionList();
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
			this.$router.push('/workbench/project');
		},
		async queryAccountList() {
			this.accountList = await this.$http.account.query();
		},
		async queryVersionList() {
			const versionList = await this.$http.project.version(this.projectId).query();
			
			if (versionList.length !== 0) {
				this.versionList = versionList.sort((versionA, versionB) => {
					return versionA.semver.replace(/\./g, '') - versionB.semver.replace(/\./g, '');
				});
			}
		}
	}
};
</script>

<style>

</style>