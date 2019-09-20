<template>
  <b-container class="desktop-admin pt-3 pb-5">
		<b-row>
			<b-col cols="3">
				<b-card no-body>
					<b-nav vertical class="w-100">
						<b-nav-item
							v-for="(nav, index) in navExtend"
							:key="index"
							:to="`/desktop/admin/${nav.path}`"
							exact
							exact-active-class="active"
						>{{ nav.label.main ? $t(nav.label.main) : nav.label.sub }}</b-nav-item>
					</b-nav>
				</b-card>
			</b-col>
			<b-col>
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

		};
	},
	computed: {
		navExtend() {
			return this.sdlc.workbench.admin;
		}
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