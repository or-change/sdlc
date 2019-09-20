<template>
  <div>
    <h2 class="mb-5">Git管理</h2>
    <b-card title="项目下载">
      <b-row>
				<b-col>
					<b-form-group label="项目地址" label-for="url">
						<b-form-input 
						id="url"
						v-model="url"
						:state="urlState"
						aria-describedby="url-checked"
						></b-form-input>
						<b-form-invalid-feedback id="url-checked">
							项目地址格式有误!
						</b-form-invalid-feedback>
					</b-form-group>
				</b-col>
      </b-row>
      <b-row>
				<b-col v-if="loading" class="text-center">
					<b-spinner variant="primary"></b-spinner>
					<strong>下载中，请稍等...</strong>
				</b-col>
				<b-col v-if="!loading">
					<div id="download-state">
						<p class="pull-left text-success" v-if="downloadState.success">下载成功!</p>
						<p class="pull-left text-danger" v-if="downloadState.failed">下载失败!</p>
					</div>
				</b-col>
        <b-col class="ml-auto" cols="auto">
          <b-btn variant="success" @click="reset">重置</b-btn>
          <b-btn variant="primary" :disabled="!urlState" @click="download">下载</b-btn>
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
			url: 'https://github.com/or-change/sdlc.git',
			loading: false,
			downloadState: {
				success: false,
				failed: false
			}
		};
	},
	computed: {
		urlState() {
			return this.url.length > 0 ? true : false;
		}
	},
	methods: {
		reset() {
			this.url = 'https://github.com/or-change/sdlc.git';
			this.loading = false;
			this.downloadState.success = false;
			this.downloadState.failed = false;
		},
		async download() {
			this.loading = true;
		
			try {
				await agent.post('/plugin/git/clone', { url: this.url });

				this.loading = false;
				this.downloadState.success = true;

				setTimeout(() => {
					this.reset();
				}, 3000);

			} catch (error) {
				if (error) {
					this.downloadState.failed = true;
				}
			}
		}
	}
};
</script>