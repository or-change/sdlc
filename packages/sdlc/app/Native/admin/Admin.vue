<template>
  <b-container class="workbench-admin pt-3 pb-5">
		<b-row>
			<b-col cols="3">
				<b-card no-body>
					<b-nav vertical class="w-100">
						<b-nav-item
							v-for="(nav, index) in navExtend"
							:key="index"
							:to="`/workbench/admin/${nav.path}`"
							exact
							exact-active-class="active"
						><i 
							v-if="nav.icon" 
							:class="['mr-2', nav.icon]"
							style="width:35px;text-align:center;"
						></i>
						<i
							v-if="!nav.icon"
							class="mr-2"
							style="display:inline-block;width:40px;"
						></i>{{ $t(nav.label) }}</b-nav-item>
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
			return this.state['admin.topics'];
		}
	},
	mounted() {

	},
	methods: {

	}
};
</script>

<style lang="scss">
.workbench-admin {
	.active {
		background-color: #E9ECEF;
		a {
			color: #343A40;
		}
	}
}
</style>