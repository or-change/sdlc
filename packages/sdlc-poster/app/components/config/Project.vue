<template>
	<div>
		<h5>项目负责人设置</h5>
		<b-row>
			<b-form-group
				label="可通知事件"
			>
				<b-form-checkbox-group
					v-model="config.events"
					:options="options.events"
					size="sm"
				></b-form-checkbox-group>
			</b-form-group>
		</b-row>
		<b-row>
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
		</b-row>
		<b-row>
			<div id="save-state">
				<p v-if="saveState.succeed" class="text-success">保存成功!</p>
				<p v-if="saveState.failed" class="text-danger">保存失败!</p>
			</div>
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
import DefaultConfig from '../utils/Config';
import axios from 'axios';

function defaultConfig() {
	return {
		events: [
			'project-created', 
			'project-updated', 
			'project-deleted', 
			'member-created', 
			'member-deleted', 
		],
		projectPreferences: ['informMember'],
		informedMethods: ['email'],
	};
}

function defaultOptions() {
	return {
		events: [
			{ text: '项目创建', value: 'project-created' },
			{ text: '项目更新', value: 'project-updated' },
			{ text: '项目删除', value: 'project-deleted' },
			{ text: '成员添加', value: 'member-created' },
			{ text: '成员删除', value: 'member-deleted' }
		],
		project: [{ text: '允许项目所有人通知项目成员', value: 'informMember' }],
		methods: [
			{ text: '邮箱', value: 'email'},
			{ text: '其他', value: 'other'}
		]
	};
}

export default {
	name: 'project-config',
	components: { DefaultConfig },
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
			const projectOwnerConfig = await axios.get(`/api/principal/${this.accountId}/config/owner`, {
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

			if (projectOwnerConfig.data) {
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

			if (projectOwnerConfig.data) {
				this.saveState.succeed = true;
			}

			setTimeout(() => {
				this.reset();
			}, 3000);
		}
	}
};
</script>