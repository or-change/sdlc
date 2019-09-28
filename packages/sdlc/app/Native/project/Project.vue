<template>
	<div>
		<div class="detail-header">
			<b-container class="pt-3">
				<h4 class="mb-5">{{ projectName }}</h4>

				<b-nav tabs class="detail-nav">
					<b-nav-item
						v-for="(nav, index) in navExtend"
						:key="index"
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
			this.projectName = project.name;
		},
	}
};
</script>

<style lang="scss">
.detail-header {
	background-color:#FAFBFC;
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