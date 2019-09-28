<template>
	<div>
		<b-row>
			<b-col>
				<h5>项目负责人设置</h5>
				<b-form-group
					label="可通知事件"
				>
					<b-form-checkbox-group
						v-if="configState"
						v-model="config.events"
						:options="options.events"
						size="sm"
					></b-form-checkbox-group>
					<p v-else>暂无，等待管理员设置</p>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-form-group
					label="项目首选项"
				>
					<b-form-checkbox-group
						v-model="config.projectPreferences"
						:options="options.project"
						stacked
						size="sm"
					></b-form-checkbox-group>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<div id="save-state">
					<p v-if="saveState.succeed" class="text-success">保存成功!</p>
					<p v-if="saveState.failed" class="text-danger">保存失败!</p>
				</div>
			</b-col>
			<b-col class="ml-auto" cols="auto">
				<b-btn
					size="sm"
					variant="success"
					@click="reset(true)"
				>重置</b-btn>
				<b-btn
					size="sm"
					variant="primary"
					v-if="hasCreated"
					@click="update"
				>修改</b-btn>
				<b-btn
					size="sm"
					variant="primary"
					v-else
					@click="create"
				>创建</b-btn>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import axios from 'axios';

function defaultConfig() {
	return {
		events: [],
		projectPreferences: ['informMember'],
	};
}

function defaultOptions() {
	return {
		events: [],
		project: [{ text: '允许项目所有人通知项目成员', value: 'informMember' }],
	};
}

export default {
	name: 'project-config',
	data() {
		return {
			accountId: this.$store.state.principal.id,
			projectId: this.$route.params.projectId,
			config: defaultConfig(),
			options: defaultOptions(),
			saveState: {
				succeed: false,
				failed: false
			},
			hasCreated: false
		};
	},
	computed: {
		configState() {
			return this.options.events.length === 0 ? false : true;
		}
	},
	mounted() {
		this.getEvents();
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
			const projectOwnerConfig = await axios.get('/api/principal/config/owner', {
				params: {
					projectId: this.projectId
				}
			});

			if (projectOwnerConfig.data) {
				this.config = projectOwnerConfig.data;
				this.hasCreated = true;
			}
		},
		async create() {
			const projectOwnerConfig = await axios.post(`/api/principal/${this.accountId}/config/owner`, {
				projectId: this.projectId,
				events: this.config.events,
				informedMethods: this.config.informedMethods,
				projectPreferences: this.config.projectPreferences
			});

			if (projectOwnerConfig) {
				this.saveState.succeed = true;
				this.hasCreated = true;
			}

			setTimeout(() => {
				this.reset();
			}, 3000);
		},
		async update() {
			const projectOwnerConfig = await axios.put(`/api/principal/${this.accountId}/config/owner`, {
				projectId: this.projectId,
				events: this.config.events,
				informedMethods: this.config.informedMethods,
				projectPreferences: this.config.projectPreferences
			});

			if (projectOwnerConfig) {
				this.saveState.succeed = true;
			}

			setTimeout(() => {
				this.reset();
			}, 3000);
		},
		async getEvents() {
			const eventsMap = {
				'account-created': '账号创建',
				'account-updated': '账号更新',
				'account-deleted': '账号删除',
				'project-created': '项目创建',
				'project-updated': '项目更新',
				'project-deleted': '项目删除',
				'member-created': '成员添加',
				'member-deleted': '成员删除',
				'authentication-failed': '认证失败',
				'authentication-succeed': '认证成功'
			};
			const adminConfig = await axios.get('/api/principal/config/admin');
			const events = [];

			adminConfig.data.projectOwner.forEach(key => {
				events.push({
					text: eventsMap[key],
					value: key
				});
			});

			this.options.events = events;
		}
	}
};
</script>