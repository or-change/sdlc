<template>
	<div>
		<div class="detail-header">
			<b-container class="pt-3">
				<h4 v-if="projectName.length !== 0" class="mb-5">{{ projectName }}</h4>
				<div v-if="projectName.length === 0">
					<h4 class="mb-5 mr-2" style="display:inline-block;">Loading</h4>
					<b-spinner variant="primary" small label="Busy"></b-spinner>
				</div>

				<b-nav tabs class="detail-nav">
					<b-nav-item
						v-for="(nav, index) in navExtend"
						:key="index"
						v-if="nav.ownerOnly === undefined || !(nav.ownerOnly && !principalIsOwner)"
						exact
						exact-active-class="active"
						:to="`/workbench/project/${projectId}/${nav.path}`"
						:title="$t(nav.label)"
					><i 
						v-if="nav.icon" 
						:class="['mr-2', nav.icon]"
					></i>{{ $t(nav.label) }}</b-nav-item>
				</b-nav>
			</b-container>
		</div>

		<b-container>
			<router-view class="pt-3 pb-5">项目详情路由框架</router-view>
		</b-container>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectName: '',
			principalIsOwner: null
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		navExtend() {
			return this.state['project.topics'];
		}
	},
	mounted() {
		this.getProjectById();
	},
	methods: {
		async getProjectById() {
			const project = await this.$http.project.get(this.projectId);
			this.principalIsOwner = project.ownerId === this.$store.state.principal.id;
			this.projectName = project.name;
		},
	}
};
</script>

<style lang="scss">
.detail-header {
	background-color:#FAFBFC;
	background-image: url('../../assets/bg-project.png');
	background-position: 0 -20px;
	background-size: cover;
	border-bottom: 1px solid #e1e4e8;

	.detail-nav {
		border-bottom:none;

		li {
			max-width: 200px;

			a {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				position: relative;
			}

			.nav-link.active::after {
				content: "";
				width: 100%;
				position: absolute;
				top: 0;
				left: 0;
				border-top: 3px solid #FF7903;
			}
		}
	}
}
</style>