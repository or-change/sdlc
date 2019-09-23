<template>
	<div>
		<b-card title="用户信息">
			<b-row>
				<b-col>
					<b-form-group label="用户ID">
						<b-form-input
							id="accountId"
							v-model="accountInfo.id"
							readonly
						></b-form-input>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-form-group label="邮箱地址">
						<b-form-input
							id="email"
							:state="emailState"
							v-model="accountInfo.email"
							aria-describedby="email-correct-format email-error-format"
						></b-form-input>
						<b-form-invalid-feedback
							id="email-error-format"
						>邮箱地址格式有误!</b-form-invalid-feedback>
						<b-form-valid-feedback
							id="email-correct-format"
						>邮箱地址格式正确</b-form-valid-feedback>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col class="ml-auto" cols="auto">
					<b-btn 
						variant="success" 
						@click="reset"
					>重置</b-btn>
					<b-btn 
						variant="primary" 
						@click="create" 
						:disabled="!emailState"
					>创建</b-btn>
				</b-col>
			</b-row>
		</b-card>
	</div>
</template>

<script>
import agent from 'http-agent';

export default {
	data() {
		return {
			accountInfo: {
				id: this.$route.params.accountId,
				email: 'alex@example.com'
			}
		};
	},
	computed: {
		emailState() {
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

			return emailReg.test(this.accountInfo.email);
		}
	},
	methods: {
		reset() {
			this.accountInfo.email = '';
		},
		async create() {

		}
	}
};
</script>