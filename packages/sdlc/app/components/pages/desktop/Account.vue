<template>
  <div>
    <b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item active>我的信息</b-breadcrumb-item>
		</b-breadcrumb>

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
			nameState: ''
		}
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
				})
				this.$bvToast.toast('更新成功', {
          title: null,
          variant: 'success',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
			} catch (error) {
				console.log(error);
				this.$bvToast.toast('更新失败', {
          title: null,
          variant: 'danger',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
			}
		}
	}
}
</script>

<style>

</style>