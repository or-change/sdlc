<template>

	<div class="desktop">
		<b-navbar toggleable="lg" type="dark" variant="dark">
			<b-navbar-brand href="#/">
				<img 
					src="../../assets/logo.png" 
					style="width:30px;height:30px;" 
					class="inline-block align-top"
				/>
				SDLC安全开发管控平台
			</b-navbar-brand>

			<b-navbar-nav>
				<b-nav-item href="#/desktop/overview">总览</b-nav-item>
				<b-nav-item href="#/desktop/project" class="ml-2">我的项目</b-nav-item>
			</b-navbar-nav>

			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<b-nav-item-dropdown right>
					<!-- Using 'button-content' slot -->
					<template
						slot="button-content"
					>{{principalName}}</template>

					<b-dropdown-item
						href="#/desktop/account"
					>我的信息</b-dropdown-item>
					<b-dropdown-divider></b-dropdown-divider>
					<b-dropdown-item @click="signout">退出</b-dropdown-item>
				</b-nav-item-dropdown>
			</b-navbar-nav> 
		</b-navbar>

		<div id="app-desktop-container"
			style="width: 100%; top: 56px; bottom: 0; overflow: auto;"
			class="position-absolute">
			<b-container>
				<router-view class="pt-3 pb-5">桌面路由框架</router-view>
			</b-container>
		</div>
	</div>

</template>

<script>
export default {
	name: 'desktop-framework',
	computed: {
		principalName() {
			return this.$store.state.principal.name;
		}
	},
	methods: {
		async signout() {
			try {
				await this.$http.principal.signout();
				
				location.reload();
			} catch (error) {
				console.log(error);
			}
		}
	}
};
</script>

<style lang="scss">

</style>
