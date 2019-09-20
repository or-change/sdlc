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
        <b-col class="ml-auto" cols="auto">
          <b-btn variant="success" @click="reset">重置</b-btn>
          <b-btn variant="primary" @click="download">下载</b-btn>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
	data() {
		return {
			url: 'https://github.com/or-change/sdlc.git',
			loading: false
		};
	},
	methods: {
		reset() {
			this.url = '';
			this.loading = false;
		},
		download() {
			this.loading = true;

			this.$api.create(this.url).then((message) => {
				if (message === 'download successfully') {
					this.loading = false;
					this.reset();
				}
			});
		}
	}
};
</script>