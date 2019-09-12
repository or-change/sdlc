<template>
	<div class="signin">
		<b-container>
			<b-row>
				<b-col
					cols="4"
					offset="4"
					class="py-5"
				>
					<b-card no-body>
						<b-card-header><center>SDLC安全管控平台</center></b-card-header>
						<b-card-body>
							<b-form
								@submit.prevent="signin"
							>
								<b-form-group
									label="用户名:"
									label-for="certificate-name"
								>
									<b-form-input
										id="certificate-name"
										v-model="certificate.body.name"
										placeholder="请输入用户名"
										size="sm"
										autocomplete="off"
									/>
								</b-form-group>
								<b-form-group
									label="密码:"
									label-for="certificate-password"
								>
									<b-form-input
										id="certificate-password"
										v-model="certificate.body.password"
										placeholder="请输入密码"
										size="sm"
										type="password"
										autocomplete="off"
									/>
								</b-form-group>
								<b-button
									:disabled="!certificate.body.name || !certificate.body.password"
									class="w-100"
									size="sm"
									variant="primary"
									type="submit"
								>登录</b-button>
							</b-form>
						</b-card-body>
						<b-card-footer><center><small>天津橙子科技有限公司</small></center></b-card-footer>
					</b-card>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
export default {
	name: 'page-signin',
	data() {
		return {
			certificate: {
				body: {
					name: '',
					password: ''
				},
				type: ''
			},
		};
	},
	methods: {
		async signin() {
			try {
				await this.$http.principal.signin(this.certificate);

				this.$router.push({
					path: '/desktop'
				});
			} catch (error) {
				console.log(error);
			}
		}
	}
}
</script>

<style lang="scss">

</style>