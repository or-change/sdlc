<template>
  <b-container class="desktop-admin pt-3 pb-5">
		<b-row>
			<b-col cols="3">
				<b-card no-body>
					<b-nav vertical class="w-100">
						<b-nav-item
							v-for="(nav, index) in navList"
							:key="index"
							:href="nav.href"
							:class="{
								'active': routeName === nav.routeName
							}"
						>{{ nav.name }}</b-nav-item>
					</b-nav>
				</b-card>
			</b-col>
			<b-col>
				<b-breadcrumb>
					<b-breadcrumb-item to="/">
						<i class="fas fa-home"></i>
					</b-breadcrumb-item>
					<b-breadcrumb-item active>管理员</b-breadcrumb-item>
					<b-breadcrumb-item active>{{ routeName }}</b-breadcrumb-item>
				</b-breadcrumb>
				<div class="h-100">
					<router-view>管理员路由框架</router-view>
				</div>
			</b-col>
		</b-row>
  </b-container>
</template>

<script>
export default {
	data() {
		return {
			navList: [
				{ name: 'DDDD', href: '', routeName: '' },
				{ name: 'EEEE', href: '', routeName: '' },
				{ name: 'FFFF', href: '', routeName: '' },
				{ name: 'FFFF', href: '', routeName: '' },
				{ name: 'FFFF', href: '', routeName: '' },
			]
		};
	},
	computed: {
		routeName() {
			return this.$route.name;
		},
	},
	mounted() {

	},
	methods: {

	}
};
</script>

<style lang="scss">
.desktop-admin {
	.active {
		background-color: #E9ECEF;
		a {
			color: #343A40;
		}
	}
}
</style>