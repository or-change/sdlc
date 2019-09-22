<template>
	<div>
		<div class="detail-header">
			<b-container class="pt-3">
				<b-breadcrumb class="detail-breadcrumb">
					<b-breadcrumb-item to="/">
						<i class="fas fa-home"></i>
					</b-breadcrumb-item>
					<b-breadcrumb-item to="/desktop/project">{{ $t('project.breadcrumb') }}</b-breadcrumb-item>
					<b-breadcrumb-item active>{{ projectName }}</b-breadcrumb-item>
				</b-breadcrumb>

				<b-nav tabs small class="detail-nav">
					<b-nav-item
						v-for="(nav, index) in navExtend"
						:key="index"
						exact
						exact-active-class="active"
						:to="`/desktop/project/${projectId}/${nav.path}`"
						:title="nav.label.main ? $t(nav.label.main) : nav.label.sub"
					>{{ nav.label.main ? $t(nav.label.main) : nav.label.sub }}</b-nav-item>
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
			return this.sdlc.workbench.project;
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

	.detail-breadcrumb {
		background-color:#FAFBFC;

		.active {
			background-color: #FAFBFC;
		}
	}

	.detail-nav {
		border-bottom:none;

		li {
			max-width: 200px;

			a {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>