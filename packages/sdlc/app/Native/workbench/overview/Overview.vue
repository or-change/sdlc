<template>
	<b-container class="pt-3 pb-5">
		<b-breadcrumb>
			<b-breadcrumb-item active>
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
		</b-breadcrumb>

		<h4 class="my-3">{{ $t('overview.projectTitle') }}</h4>
		<b-card-group class="text-center">
			<b-card 
				v-for="(projectCount, index) in projectCountList"
				:key="index"
				no-body
				:header="$t(projectCount.header)"
			>
				<b-card-text>
					<custom-number 
						:value="projectCount.count" 
						:style="`color:${projectCount.color}`"
					/>
				</b-card-text>
			</b-card>
		</b-card-group>
	</b-container>
</template>

<script>
export default {
	data() {
		return {
			projectCountList: {
				total: { header: 'overview.projectSum', color: '' , count: 0 },
				owner: { header: 'overview.projectOwn', color: '#1390FF', count: 0 },
				member: { header: 'overview.projectMember', color: '#72B422', count: 0 }
			}
		};
	},
	computed: {
		accountId() {
			return this.$store.state.principal.id;
		}
	},
	mounted() {
		this.queryProjectList();
	},
	methods: {
		async queryProjectList() {
			const projectList = await this.$http.project.query();

			this.projectCountList.total.count = projectList.length;
			projectList.forEach(project => {
				if (project.ownerId === this.accountId) {
					this.projectCountList.owner.count ++;
				} else {
					this.projectCountList.member.count ++;
				}
			});
		}
	}
};
</script>

<style>

</style>