<template>
	<div>
		<b-row>
			<b-col cols="3">
				<b-form-group label="请选择版本:">
					<b-form-select 
						v-model="versionSelected.id" 
						:options="versionSelector" 
						size="sm"
					></b-form-select>
				</b-form-group>
			</b-col>
			<b-col cols="3">
				<b-form-group label="创建时间:">
					<b-form-input 
						:value="versionSelected.createdAt | dateFormat" 
						size="sm" 
						readonly
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
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="info"
					@click="showCreateVersion()"
				><i
					class="fas fa-plus mr-2"
				/>添加新版本</b-button>
			</b-col>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="success"
					@click="updateVersion"
				><i
					class="fas fa-check mr-2"
				/>更新版本信息</b-button>
			</b-col>
		</b-row>

		<b-modal ref="create-version-modal" hide-footer title="创建新版本">
			<VersionCreate
				:projectId="projectId"
				@queryVersionList="queryVersionList"
			></VersionCreate>
		</b-modal>

	</div>
</template>

<script>
import VersionCreate from './VersionCreate';

export default {
	components: {
		VersionCreate
	},
	data() {
		return {
			versionList: [],
			versionSelector: [],
			versionSelected: {
				id: '',
				createdAt: '',
				abstract: ''
			}
		};
	},
	watch: {
		'versionSelected.id'() {
			const { semver, createdAt, abstract } = this.versionList.find(version => {
				return version.id === this.versionSelected.id;
			});

			this.versionSelected.semver = semver;
			this.versionSelected.createdAt = createdAt;
			this.versionSelected.abstract = abstract;
		}
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

				this.versionSelected.id = versionList[0].id;

				this.versionSelector = [];
				versionList.forEach(version => {
					this.versionSelector.push({
						value: version.id,
						text: `v${version.semver}`
					});
				});
			}
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

		showCreateVersion() {
			this.$refs['create-version-modal'].show();
		}
	}
};
</script>

<style>

</style>