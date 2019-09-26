<template>
	<div class="signin">
		<b-container class="center">
			<div style="margin-bottom:150px;">
				<h1 class="text-center text-white">{{ $t('signin.title') }}</h1>
			</div> 

			<b-row>
				<b-col cols="4" offset="4">
					<b-card no-body class="signin-body"> 
						<b-card-header style="border-bottom:2px solid #FF7903;">
							<center>{{ $t('signin.submit') }}</center>
						</b-card-header>
						<b-card-body>
							<b-form
								@submit.prevent="signin"
							>
								<b-form-input
									id="certificate-name"
									v-model="certificate.body.name"
									:placeholder="`${$t('signin.username')}...`"
									autocomplete="off"
								/>
								<b-form-input
									id="certificate-password"
									v-model="certificate.body.password"
									:placeholder="`${$t('signin.password')}...`"
									type="password"
									autocomplete="off"
									class="my-3"
									@keyup.native.enter="signin"
								/>
								<p class="text-right">
									<b-link
										@click="$i18n.locale = ($i18n.locale === 'zh' ? 'en' : 'zh')"
									>{{ $t('signin.language') }}</b-link>
								</p>
								<b-button
									:disabled="!certificate.body.name || !certificate.body.password"
									class="w-100"
									variant="success"
									type="submit"
								>{{ $t('signin.submit') }}</b-button>
							</b-form>
						</b-card-body>
					</b-card>
				</b-col>
			</b-row>
			<div style="margin-top:250px;">
				<p class="text-center text-white">Copyright&nbsp;©&nbsp;2019&nbsp;{{ $t('signin.footer') }}</p>
			</div>
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
					path: '/workbench'
				});
			} catch (error) {
				console.log(error);
			}
		}
	}
};
</script>

<style lang="scss">
.signin {
	height: 100%;
	background-image: url('../../assets/bg.jpg');
	position: relative;

	.center {
		position: absolute;
		top: 55%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
}
</style>