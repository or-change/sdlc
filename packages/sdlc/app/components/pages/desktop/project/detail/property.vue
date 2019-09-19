<template>
	<div>
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
		};
	},
	computed: {
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
	mounted() {
		this.getProjectById();
		this.queryAccountList();
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
	}
};
</script>

<style>

</style>