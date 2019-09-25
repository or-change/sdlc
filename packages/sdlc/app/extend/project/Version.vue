<template>
	<div>
		<b-row>
			<b-col>
				<b-row>
					<b-col cols="6">
						<b-form-group label="版本号: (格式: 1.0.0):">
							<b-form-input 
								v-model="versionSelected.semver" 
								size="sm" 
								:readonly="versionSelected.id !== ''"
							></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col>
						<b-form-group label="版本简介:">
							<b-form-textarea 
								rows="3"
								no-resize
								size="sm" 
								v-model="versionSelected.abstract"
							></b-form-textarea>
						</b-form-group>
					</b-col>
				</b-row>
				<b-row>
					<b-col v-if="versionSelected.id === ''" cols="4">
						<b-button
							class="w-100" size="sm" variant="info"
							@click="createVersion()"
						><i
							class="fas fa-plus mr-2"
						/>添加新版本</b-button>
					</b-col>
					<b-col v-if="versionSelected.id !== ''" cols="4">
						<b-button
							class="w-100" size="sm" variant="success"
							@click="updateVersion()"
						><i
							class="fas fa-check mr-2"
						/>更新版本信息</b-button>
					</b-col>
				</b-row>
			</b-col>
			<b-col>
				<b-table
					small
					hover
					sticky-header
					selectable
					select-mode="single"
					selected-variant="active"
					@row-selected="onRowSelected"
					:fields="[
						{ key: 'semver', label: '版本号' },
						{ key: 'createdAt', label: '创建时间' }
					]"
					:items="versionList"
					class="version-list text-center"
				>
					<template
						v-slot:cell(createdAt)="data"
					>{{ data.item.createdAt | dateFormat }}</template>
				</b-table>
			</b-col>
		</b-row>

	</div>
</template>

<script>
export default {
	data() {
		return {
			versionList: [],
			versionSelected: {
				id: '',
				semver: '',
				createdAt: '',
				abstract: ''
			}
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
	},
	mounted() {
		this.queryVersionList();
	},
	methods: {
		async queryVersionList() {
			const versionList = await this.$http.project.version(this.projectId).query();
			
			if (versionList.length !== 0) {
				this.versionList = versionList.sort((versionA, versionB) => {
					return versionA.semver.replace(/\./g, '') - versionB.semver.replace(/\./g, '');
				});
			}
			// console.log(this.versionList);
		},
		async updateVersion() {
			try {
				await this.$http.project.version(this.projectId).update(this.versionSelected.id, {
					abstract: this.versionSelected.abstract
				});
				this.showToast('success', '更新成功');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '更新失败');
			}
		},
		async createVersion() {
			try {
				await this.$http.project.version(this.projectId).create({
					semver: this.versionSelected.semver,
					abstract: this.versionSelected.abstract
				});
				this.showToast('success', '添加成功');
				this.queryVersionList();
			} catch (error) {
				console.log(error);
				this.showToast('danger', '添加失败');
			}
		},
		onRowSelected(items) {
			if (items.length === 0) {
				this.versionSelected.id = '';
				this.versionSelected.semver = '';
				this.versionSelected.createdAt = '';
				this.versionSelected.abstract = '';
			} else {
				this.versionSelected.id = items[0].id;
				this.versionSelected.semver = items[0].semver;
				this.versionSelected.createdAt = items[0].createdAt;
				this.versionSelected.abstract = items[0].abstract;
			} 
		}
	}
};
</script>

<style>

</style>