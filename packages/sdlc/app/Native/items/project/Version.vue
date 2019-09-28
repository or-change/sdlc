<template>
	<div>
		<b-row>
			<b-col>
				<b-row>
					<b-col cols="6">
						<b-form-group :label="$t('version.semver')">
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
						<b-form-group :label="$t('version.abstract')">
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
						/>{{ $t('version.create') }}</b-button>
					</b-col>
					<b-col v-if="versionSelected.id !== ''" cols="4">
						<b-button
							class="w-100" size="sm" variant="success"
							@click="updateVersion()"
						><i
							class="fas fa-check mr-2"
						/>{{ $t('version.update') }}</b-button>
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
						{ key: 'semver', label: $t('version.semverTable') },
						{ key: 'createdAt', label: $t('version.createdAt') }
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
	props: {
		versionList: Array
	},
	data() {
		return {
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
		// this.queryVersionList();
	},
	methods: {
		async updateVersion() {
			try {
				await this.$http.project.version(this.projectId).update(this.versionSelected.id, {
					abstract: this.versionSelected.abstract
				});
				this.showToast('success', this.$t('version.updateSuccess'));
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('version.updateFailed'));
			}
		},
		async createVersion() {
			try {
				await this.$http.project.version(this.projectId).create({
					semver: this.versionSelected.semver,
					abstract: this.versionSelected.abstract
				});
				this.showToast('success', this.$t('version.createSuccess'));
				this.$emit('queryVersionList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('version.createFailed'));
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