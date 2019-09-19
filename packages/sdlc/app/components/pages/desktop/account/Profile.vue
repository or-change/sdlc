<template>
	<div>
		<b-row>
			<b-col cols="3" style="text-align: center">
				<div>
					<i class="fas fa-user" style="font-size:80px"></i>
				</div>
			</b-col>
			<b-col cols="3">
				<b-form-group label="用户名:">
					<b-form-input
						trim
						size="sm"
						v-model='account.name'
						placeholder="输入用户名"
					></b-form-input>
				</b-form-group>
			</b-col>
			<b-col cols="3">
				<b-form-group label="管理员:">
					<b-form-input
						trim
						size="sm"
						:value="account.administrator ? '是' : '否'"
						readonly
					></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>
		<div style="text-align:right;">
			<b-button variant="primary" size="sm" @click="updateAccount">更新</b-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			account: {
				name: '',
				administrator: null,
				avatar: ''
			},
			nameState: '',
		};
	},
	computed: {
		accountId() {
			return this.$store.state.principal.id;
		}
	},
	mounted() {
		this.getAccountById();
	},
	methods: {
		async getAccountById() {
			const account = (await this.$http.principal.get(this.accountId)).account;
			this.account.name = account.name;
			this.account.administrator = account.administrator;
			this.account.avatar = account.avatarHash;
		},
		async updateAccount() {
			try {
				await this.$http.principal.update({
					name: this.account.name
				});
				this.showToast('success', '更新成功');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '更新失败');
			}
		}
	}
};
</script>

<style>

</style>