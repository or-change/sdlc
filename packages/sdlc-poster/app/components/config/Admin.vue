<template>
	<b-container fluid>
		<b-row>
			<h5>消息通知设置</h5>
			<b-col>
				<b-form-group
					label="管理员"
				>
					<b-form-checkbox-group
						v-model="config.admin"
						:options="options.admin"
						size="sm"
					></b-form-checkbox-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-form-group
					label="项目负责人"
				>
					<b-form-checkbox-group
						v-model="config.projectOwner"
						:options="options.projectOwner"
						size="sm"
					></b-form-checkbox-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-form-group
					label="其他"
				>
					<b-form-checkbox-group
						v-model="config.others"
						:options="options.others"
						size="sm"
					></b-form-checkbox-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<div id="save-state">
				<p v-if="saveState.succeed" class="text-success">保存成功!</p>
				<p v-if="saveState.failed" class="text-danger">保存失败!</p>
			</div>
			<b-col class="ml-auto p-0" cols="auto">
				<b-btn
					size="sm"
					variant="success"
					@click="reset(true)"
				>重置</b-btn>
				<b-btn
					size="sm"
					variant="primary"
					@click="save"
				>保存</b-btn>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import axios from 'axios';

function defaultOptions() {
	return  [
		{ text: '账号创建', value: 'account-created' },
		{ text: '账号更新', value: 'account-updated' },
		{ text: '账号删除', value: 'account-deleted' },
		{ text: '项目创建', value: 'project-created' },
		{ text: '项目更新', value: 'project-updated' },
		{ text: '项目删除', value: 'project-deleted' },
		{ text: '成员添加', value: 'member-created' },
		{ text: '成员删除', value: 'member-deleted' },
		{ text: '认证成功', value: 'authentication-succeed'},
		{ text: '认证失败', value: 'authentication-failed'}
	];
}

function defaultConfig() {
	return {
		admin: ['account-created'],
		projectOwner: ['account-created'],
		others: ['account-created']
	};
}

export default {
	name: 'admin-config',
	data() {
		return {
			accountId: this.$store.state.principal.id,
			config: defaultConfig(),
			options: {
				admin: defaultOptions(),
				projectOwner: defaultOptions(),
				others: defaultOptions()
			},
			saveState: {
				succeed: false,
				failed: false
			}
		};
	},
	mounted() {
		this.getConfig();
	},
	methods: {
		reset(flag) {
			if (flag) {
				this.config = defaultConfig();
			}

			this.saveState.succeed = false;
			this.saveState.failed = false;
		},
		async getConfig() {
			const adminConfig = await axios.get(`/api/principal/${this.accountId}/config/admin`);
			
			if (adminConfig.data) {
				this.config = adminConfig.data;
			}
		},
		async save() {
			const adminConfig = await axios.post(`/api/principal/${this.accountId}/config/admin`, this.config);

			if (adminConfig) {
				this.saveState.succeed = true;
			} 

			setTimeout(() => {
				this.reset();
			}, 3000);
		},
	}
};
</script>