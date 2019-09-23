<template>
  <b-container class="desktop-account pt-3 pb-5">
		<b-row>
			<b-col cols="3">
				<b-card no-body>
					<b-nav vertical class="w-100">
						<b-nav-item
							v-for="(nav, index) in navExtend"
							:key="index" 
							:to="`/desktop/account/${nav.path}`"
							exact
							exact-active-class="active"
						>{{ $t(nav.label) }}</b-nav-item>
					</b-nav>
				</b-card>
			</b-col>
			<b-col>
				<router-view>用户路由框架</router-view>
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
			return this.sdlc.workbench.account;
		}
	}
};
</script>

<style lang="scss">
.desktop-account {
	.active {
		background-color: #E9ECEF;
		a {
			color: #343A40;
		}
	}
}
</style>