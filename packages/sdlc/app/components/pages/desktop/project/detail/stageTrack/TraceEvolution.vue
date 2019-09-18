<template>
  <div>
    <b-form-group label="阶段演进至:">
      <b-form-select
        v-model="newTrace.stageId"
        :options="evolutionStageSelector"
        size="sm"
      ></b-form-select>
    </b-form-group>
    <b-form-group label="选择版本:">
      <b-form-select
        v-if="promoted"
        v-model="newTrace.versionId"
        :options="versionSelector"
        size="sm"
      ></b-form-select>
      <div v-if="!promoted">此阶段不可提升版本</div>
    </b-form-group>
    <b-form-group label="简介:">
      <b-form-textarea
        rows="3"
        no-resize
        size="sm"
        v-model='newTrace.abstract'
      ></b-form-textarea>
    </b-form-group>
    <b-button class="mt-3" variant="success" block @click="createTrace()">确认演进</b-button>
    <!-- <b-button class="mt-2" variant="warning" block @click="hideInitFlowModal()">关闭并清除填入信息</b-button> -->
  </div>
</template>

<script>
export default {
  props: {
    projectId: String,
    evolutionStageSelector: Array,
    versionSelector: Array,
    promoted: Boolean,
    traceList: Array,
    traceActive: String,
    flowSelected: String
  },
  data() {
    return {
			newTrace: {
				parentId: null,
				flowId: '',
				stageId: '',
				versionId: '',
				abstract: ''
			},
    }
  },
  methods: {
		async createTrace() {
      this.newTrace.parentId = this.traceActive;
      this.newTrace.flowId = this.flowSelected;

      if (!this.promoted) {
        this.newTrace.versionId = this.traceList.find(trace => trace.id === this.traceActive).versionId;
      }

			try {
				await this.$http.project.trace(this.projectId).create(this.newTrace);
				this.showToast('success', '创建成功');
				this.$emit('queryTraceList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '创建失败');
			}
		},
  }
}
</script>