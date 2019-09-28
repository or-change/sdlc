<template>
	<b-container class="pt-3 pb-5">
		<b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item active>{{ $t('projectAll.breadcrumb') }}</b-breadcrumb-item>
		</b-breadcrumb>

		<div class="mb-3 position-relative">
			<b-form-checkbox-group
				v-model="projectOwnerDisplay"
				:options="[
					{ text: $t('projectAll.owned'), value: 'owner' },
					{ text: $t('projectAll.joined'), value: 'member' },
				]"
				name="project-owner"
				button-variant="primary"
				size="sm"
				buttons
			></b-form-checkbox-group>

			<b-button
				size="sm"
				variant="info"
				class="ml-4"
				@click="showCreateProjectModal()"
			><i
				class="fas fa-plus mr-2"
			/>{{ $t('projectAll.newProject.title') }}</b-button>

			<b-pagination
				size="sm" 
				aria-controls="project-all"
				v-model="currentPage" 
				:total-rows="rows" 
				:per-page="perPage"
				class="position-absolute"
				style="top:0;right:0;"
			></b-pagination>
		</div>

		<b-table
			small
			striped 
			hover
			:fields="[
				{ key: 'name', label: $t('projectAll.projectList.name') },
				{ key: 'owner', label: $t('projectAll.projectList.owner') },
				{ key: 'createdAt', label: $t('projectAll.projectList.createAt') },
				{ key: 'action', label: $t('projectAll.projectList.action') }
			]"
			id="project-all"
			:items="projectRenderList"
			:busy="projectIsBusy || accountIsBusy"
			:per-page="perPage"
			:current-page="currentPage"
			class="text-center project-list"
		>
			<template v-slot:cell(name)="data">
				<b-link :href='`#/workbench/project/${data.item.id}`'>{{ data.item.name }}</b-link>
			</template>

			<template v-slot:cell(owner)="data">
				{{ accountList.find(account => account.id === data.item.ownerId).name }}
			</template>

			<template v-slot:cell(createdAt)="data">
				{{ data.item.createdAt | dateFormat }}
			</template>

			<template v-slot:cell(action)="data">
				<b-button
					size="sm"
					variant="link"
					@click="deleteProject(data.item.id)"
				>{{ $t('projectAll.projectList.delete') }}</b-button>
			</template>

			<template v-slot:table-busy>
				<div class="text-center text-danger my-2">
					<b-spinner class="align-middle"></b-spinner>
					<strong>Loading...</strong>
				</div>
			</template>
		</b-table>

		<b-modal ref="create-project-modal" hide-footer :title="$t('projectAll.newProject.title')">
			<div>
				<b-form-group :label="$t('projectAll.newProject.name')">
					<b-form-input 
						size="sm" 
						v-model="newProject.name" 
						:state="nameState"
					></b-form-input>
				</b-form-group>
				<b-form-group :label="$t('projectAll.newProject.abstract')">
					<b-form-textarea 
						rows="3"
						no-resize
						size="sm" 
						v-model='newProject.abstract'
						:state="abstractStage"
					></b-form-textarea>
				</b-form-group>
			</div>
			<b-button 
				class="mt-3" 
				variant="primary" 
				block 
				@click="createProject" 
				:disabled="!nameState || !abstractStage"
			>{{ $t('projectAll.newProject.submit') }}</b-button>
			<b-button 
				class="mt-2" 
				variant="warning" 
				block 
				@click="hideCreateProjectModal()"
			>{{ $t('projectAll.newProject.close') }}</b-button>
		</b-modal>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			projectList: [],
			accountList: [],
			projectIsBusy: false,
			accountIsBusy: false,
			perPage: 15,
			currentPage: 1,
			projectOwnerDisplay: ['owner', 'member'],
			newProject: {
				name: '',
				abstract: ''
			}
		};
	},
	computed: {
		principalId() {
			return this.$store.state.principal.id;
		},
		nameState() {
			return this.newProject.name.length > 0;
		},
		abstractStage() {
			return this.newProject.abstract.length > 0;
		},
		projectRenderList() {
			const list = this.projectList.filter(project => {
				if (this.projectOwnerDisplay.length === 1 
					&& this.projectOwnerDisplay[0] === 'owner') {
					return project.ownerId === this.principalId;
				} 
				else if (this.projectOwnerDisplay.length === 1 
					&& this.projectOwnerDisplay[0] === 'member') {
					return project.ownerId !== this.principalId;
				} else if (this.projectOwnerDisplay.length === 0) {
					return false;
				}
				else {
					return true;
				}
			});

			return list.sort((projectA, projectB) => {
				return Date.parse(projectB.createdAt) - Date.parse(projectA.createdAt);
			});
		},
		rows() {
			return this.projectRenderList.length;
		}
	},
	mounted() {
		this.queryProjectList();
		this.queryAccountList();
	},
	methods: {
		async queryProjectList() {
			this.projectIsBusy = true;
			this.projectList = await this.$http.project.query();
			this.projectIsBusy = false;
		},
		async queryAccountList() {
			this.accountIsBusy = true;
			this.accountList = await this.$http.account.query();
			this.accountIsBusy = false;
		},
		async createProject() {
			try {
				await this.$http.project.create(this.newProject);
				this.showToast('success', this.$t('projectAll.newProject.success'));
				this.hideCreateProjectModal();
				this.queryProjectList();
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('projectAll.newProject.failed'));
			}
		},
		async deleteProject(projectId) {
			try {
				await this.$http.project.delete(projectId);
				this.showToast('success', this.$t('projectAll.projectList.success'));
				this.queryProjectList();
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('projectAll.projectList.failed'));
			}
		},
		showCreateProjectModal() {
			this.$refs['create-project-modal'].show();
		},
		hideCreateProjectModal() {
			this.$refs['create-project-modal'].hide();
			this.newProject = {
				name: '',
				abstract: ''
			};
		},
	}
};
</script>

<style lang="scss">
.project-list {
	th {
		width: 25%;
	}
	td {
		width: 25%;
	}
}
</style>