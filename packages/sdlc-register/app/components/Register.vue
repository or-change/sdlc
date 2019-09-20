<template>
	<div>
		<b-card title="插件注册">
			<b-row class="my-2">
				<b-col cols="3" class="text-right">
					<label for="name">名称:</label>
				</b-col>
				<b-col cols="6" class="text-left">
					<b-form-input
						size="sm"
						label-for="name"
						v-model="account.name"
						:state="nameState"
					></b-form-input>
				</b-col>
			</b-row>
			<b-row class="my-2">
				<b-col cols="3" class="text-right">
					<label for="adminiator">管理员:</label>
				</b-col>
				<b-col>
					<b-form-radio-group
						v-model="account.adminiator"
						:options="[
							{ text: '是', value: true },
							{ text: '否', value: false }
						]"
					></b-form-radio-group>
				</b-col>
			</b-row>
			<b-row class="my-2">
				<b-col cols="3" class="text-right">
					<label for="avatarHash">头像Hash:</label>
				</b-col>
				<b-col cols="6" class="text-left">
					<b-form-input
						size="sm"
						label-for="avatarHash"
						v-model="account.avatarHash"
					></b-form-input>
				</b-col>
			</b-row>
			<b-row class="mt-">
				<b-col cols="3" class="text-right">
					<div id="create-state">
						<p v-if="createState.success" class="pull-right text-success">创建成功!</p>
						<p v-if="createState.failed" class="pull-right text-danger">创建失败!</p>
					</div>
				</b-col>
				<b-col class="text-right" cols="6">
					<b-btn variant="success" @click="reset">重置</b-btn>
					<b-btn variant="primary" @click="create" :disabled="!nameState">创建</b-btn>
				</b-col>
			</b-row>
		</b-card>
	</div>
</template>

<script>
import agent from 'http-agent';

function defaultAccount() {
	return {
		name: '',
		adminiator: false,
		avatarHash: null
	};
}

export default {
	data() {
		return {
			account: defaultAccount(),
			createState: {
				success: false,
				failed: false
			}
		};
	},
	computed: {
		nameState() {
			return this.account.name.length > 0 ? true : false;
		}
	},
	methods: {
		reset() {
			this.account = defaultAccount();
			this.createState.success = false;
			this.createState.failed = false;
		},
		async create() {

			try {
				const newAccount = await agent.post('/account/register', this.account);
	
				if (newAccount) {
					this.createState.success = true;
				}
	
				setTimeout(() => {
					this.reset();
				}, 3000);
			} catch (error) {
				if (error) {
					this.createState.failed = true;
				}
			}
		}
	}
};
</script>