<template>
  <div>
		<b-row>
			<b-col>
				<b-form-group label="项目地址" label-for="url">
					<b-form-input
						size="sm"
						id="url" 
						v-model="url" 
						:state="urlState" 
						aria-describedby="url-checked"
						></b-form-input>
					<b-form-invalid-feedback id="url-checked">项目地址格式有误!</b-form-invalid-feedback>
				</b-form-group>
			</b-col>
		</b-row>
		<b-row>
			<b-col v-if="downloadState.suceess || downloadState.failed">
				<div id="download-state">
					<p class="pull-left text-success" v-if="downloadState.success">下载成功!</p>
					<p class="pull-left text-danger" v-if="downloadState.failed">下载失败!</p>
				</div>
			</b-col>
			<b-col class="ml-auto" cols="auto">
				<b-btn
					size="sm"
					variant="success" 
					@click="reset"
				>重置</b-btn>
				<b-btn
					size="sm"
					variant="primary"
					:disabled="!urlState"
					target="_blank"
					:href="`/api/plugin/git/clone?url=${url}`"
				>下载</b-btn>
			</b-col>
		</b-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			url: 'https://github.com/or-change/sdlc.git',
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
			this.downloadState.success = false;
			this.downloadState.failed = false;
		},
		async download() {
			try {
				await axios.get(
					'/plugin/git/clone',
					{
						url: this.url
					},
					{
						responseType: 'blob'
					}
				);

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