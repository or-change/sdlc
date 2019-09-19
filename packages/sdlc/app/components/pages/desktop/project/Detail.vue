<template>
	<div>
		<div class="detail-header">
			<b-container class="pt-3">
				<b-breadcrumb class="detail-breadcrumb">
					<b-breadcrumb-item to="/">
						<i class="fas fa-home"></i>
					</b-breadcrumb-item>
					<b-breadcrumb-item to="/desktop/project">我的项目</b-breadcrumb-item>
					<b-breadcrumb-item active>{{ projectName }}</b-breadcrumb-item>
				</b-breadcrumb>

				<b-nav tabs small class="detail-nav">
					<b-nav-item
						v-for="(nav, index) in navList"
						:key="index"
						:href="`#/desktop/project/${projectId}/${nav.href}`"
						:active="routeName === nav.routeName"
						:title="nav.name"
					><i :class="`${nav.icon} mr-2`"></i>{{ nav.name }}</b-nav-item>
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
			navList: [
				{ name: '项目属性', icon: 'fas fa-align-justify', href: 'property', routeName: 'project-property' },
				{ name: '项目成员', icon: 'fas fa-users', href: 'member', routeName: 'project-member' },
				{ name: '版本信息', icon: 'fas fa-bookmark', href: 'version', routeName: 'project-version' },
				{ name: '阶段追踪', icon: 'fas fa-shoe-prints', href: 'track', routeName: 'project-track' },
				{ name: '长标题测试长标题测试长标题测试', icon: 'fas fa-atom', href: '', routeName: '' },
			]
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		routeName() {
			return this.$route.name;
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