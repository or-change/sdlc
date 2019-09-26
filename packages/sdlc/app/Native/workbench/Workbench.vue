<template>

	<div class="workbench">
		<b-navbar toggleable="lg" type="dark" variant="dark">
			<b-navbar-brand href="#/">
				<img 
					src="../../assets/logo.png" 
					style="width:30px;height:30px;" 
					class="inline-block align-top"
				/>
				{{ $t('workbench.title') }}
			</b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<b-nav-item 
						v-for="(nav, index) in extension.nav"
						:key="index"
						:href="`#/workbench/${nav.path}`" 
					>{{ $t(nav.label) }}</b-nav-item>
				</b-navbar-nav>

				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-nav-item-dropdown  :text="$t('workbench.lang')" right>
						<b-dropdown-item @click="$i18n.locale='zh'">中文</b-dropdown-item>
						<b-dropdown-item @click="$i18n.locale='en'">English</b-dropdown-item>
					</b-nav-item-dropdown>

					<b-nav-item-dropdown right>
						<!-- Using 'button-content' slot -->
						<template
							slot="button-content"
						>{{principalName}}</template>

						<b-dropdown-item
							v-for="(dropdownItem, index) in extension.dropdown"
							:key="index"
							:href="`#/workbench/${dropdownItem.path}`" 
						>{{ $t(dropdownItem.label) }}</b-dropdown-item>
						<b-dropdown-divider></b-dropdown-divider>
						<b-dropdown-item @click="signout">{{ $t('workbench.signout') }}</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav> 
			</b-collapse>
		</b-navbar>

		<div 
			id="app-workbench-container"
			style="width: 100%; overflow: auto;"
		>
			<router-view>桌面路由框架</router-view>
		</div>
	</div>

</template>

<script>
export default {
	name: 'workbench-framework',
	computed: {
		principalName() {
			return this.$store.state.principal.name;
		},
		extension() {
			return this.state;
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
