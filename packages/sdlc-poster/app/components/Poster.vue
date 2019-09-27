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
            size="sm"
            id="events"
            v-model="accountInfo.events"
            :options="eventOptions"
          ></b-form-checkbox-group>
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

export default {
	data() {
		return {
			accountInfo: {
				id: this.$store.state.principal.id,
				email: '',
				informMethods: ['email'],
				events: []
			},
			eventOptions: [
				{ text: 'a', value: 'a'}
			],
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
		this.getAccountInfo();
		this.$http.project.get(this.$route.params.projectId).then(data => {
			this.ownerId = data.ownerId;
		});
	},
	computed: {
		emailState() {
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

			return emailReg.test(this.accountInfo.email);
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
					`/api/principal/${this.accountInfo.id}/email`,
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
					`/api/principal/${this.accountInfo.id}/email`,
					{ email: this.accountInfo.email }
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
				`/api/principal/${this.$store.state.principal.id}/email`
			);

			if (accountInfo.data) {
				this.hasCreated = true;
			}

			this.accountInfo.email = accountInfo.data.email;
		}
	}
};
</script>