<template>
  <div>
    <b-row>
      <b-col>
      <h5>Email配置</h5>
        <b-form-group label="邮箱地址">
          <b-form-input size="sm" id="email" :state="emailState" v-model="accountInfo.email"></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
		<h5>消息通知</h5>
    <b-row>
      <b-col>
        <b-form-group 
					label="可选事件"
				>
          <b-form-checkbox-group
						v-if="configState"
            size="sm"
            id="events"
            v-model="accountInfo.events"
            :options="eventOptions"
          ></b-form-checkbox-group>
					<p v-else>暂无，等待管理员及项目负责人设置</p>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="通知方式">
          <b-form-checkbox-group 
						size="sm"
						:options="[
							{ text: 'email', value: 'email' },
							{ text: '其他', value: 'other' }
						]"
						v-model="accountInfo.informMethods"
					></b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div id="action-state">
          <p class="pull-left text-success" v-if="createState.success">创建成功!</p>
          <p class="pull-left text-danger" v-if="createState.failed">创建失败!</p>
          <p class="pull-left text-success" v-if="updateState.success">更新成功!</p>
          <p class="pull-left text-danger" v-if="updateState.failed">更新失败!</p>
        </div>
      </b-col>
      <b-col class="ml-auto" cols="auto">
        <b-btn size="sm" variant="success" @click="reset(true)">重置</b-btn>

        <b-btn
          v-if="hasCreated"
          variant="primary"
          @click="update"
          :disabled="!emailState"
          size="sm"
        >修改</b-btn>
        <b-btn v-else variant="primary" @click="create" :disabled="!emailState" size="sm">创建</b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';

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

export default {
	data() {
		return {
			accountInfo: {
				id: this.$store.state.principal.id,
				email: '',
				informMethods: ['email'],
				events: []
			},
			eventOptions: [],
			createState: {
				success: false,
				failed: false
			},
			updateState: {
				success: false,
				failed: false
			},
			hasCreated: false,
			ownerId: ''
		};
	},
	mounted() {
		this.getEvents();
		this.getAccountInfo();

	},
	computed: {
		emailState() {
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

			return emailReg.test(this.accountInfo.email);
		},
		configState() {
			return this.eventOptions.length === 0 ? false : true;
		}
	},
	methods: {
		reset(flag = false) {
			this.createState.success = false;
			this.createState.failed = false;
			this.updateState.success = false;
			this.updateState.failed = false;

			if (flag === true) {
				this.accountInfo.email = '';
			}
		},
		async create() {
			try {
				const accountInfo = await axios.post(
					`/api/principal/${this.accountInfo.id}/config`,
					this.accountInfo
				);

				if (accountInfo) {
					this.createState.success = true;
					this.hasCreated = true;
				}

				setTimeout(() => {
					this.reset();
				}, 3000);
			} catch (error) {
				if (error) {
					this.createState.failed = true;
				}
			}
		},
		async update() {
			try {
				const accountInfo = await axios.put(
					`/api/principal/${this.accountInfo.id}/config`,
					this.accountInfo
				);

				if (accountInfo) {
					this.updateState.success = true;
				}

				setTimeout(() => {
					this.reset();
				}, 3000);
			} catch (error) {
				if (error) {
					this.updateState.failed = true;
				}
			}
		},
		async getAccountInfo() {
			const accountInfo = await axios.get(
				`/api/principal/${this.$store.state.principal.id}/config`
			);

			if (accountInfo.data) {
				this.hasCreated = true;
				this.accountInfo.email = accountInfo.data.email;
				this.accountInfo.events = accountInfo.data.events;
				this.accountInfo.informMethods = accountInfo.data.informMethods;
			}

		},
		async getEvents() {
			const adminEvents = await axios.get('/api/principal/config/admin'); 
			const ownerEvents = await axios.get('/api/principal/config/owner', {
				params: {
					projectId: '76a1d62d'
				}
			}); 
			const events = adminEvents.data.other;

			if (this.$store.state.principal.administrator) {
				adminEvents.data.admin.forEach(key => {
					if (events.indexOf(key) < 0) {
						events.push(key);
					}
				});
			}

			if (ownerEvents.data) {
				ownerEvents.data.events.forEach(key => {
					if (events.indexOf(key) < 0 
						&& ownerEvents.data.projectPreferences.indexOf('informMember') >= 0) {
						events.push(key);
					}
				});
			}

			events.forEach((key, index) => {
				events[index] = {
					text: eventsMap[key],
					value: key
				};
			});

			this.eventOptions = events;
		}
	}
};
</script>