<template>
  <div>
    <b-form-group label="流程名称:">
      <b-form-input size="sm" v-model="newFlow.name"></b-form-input>
    </b-form-group>
    <b-form-group label="父级流程:">
      <b-form-select
        v-if="flowSelector.length !== 0"
        v-model="newFlow.parentId"
        :options="flowSelector"
        size="sm"
      ></b-form-select>
      <div v-if="flowSelector.length === 0">无</div>
    </b-form-group>
    <b-form-group label="阶段:">
      <div v-if="newFlow.stageList.length !== 0">
        <b-card
          v-for="(stage, index) in newFlow.stageList"
          :key="index"
          class="mb-3"
        >
          <b-form-group label-size="sm" :label="`${index + 1} 阶段名称:`">
            <b-form-input size="sm" v-model="stage.name"></b-form-input>
          </b-form-group>

          <b-form-group label-size="sm" label="配置:">
            <b-form-checkbox switch v-model="stage.promoted">版本是否可提升</b-form-checkbox>
            <b-form-checkbox switch v-model="stage.initializable">是否可初始化</b-form-checkbox>
          </b-form-group>

          <b-form-group label-size="sm" label="可用工具:">
            <!-- <b-form-checkbox-group
              v-model="stage.plugins"
              :options="pluginList"
              size="sm"
            ></b-form-checkbox-group> -->
          </b-form-group>

          <b-button
            class="w-100"
            size="sm"
            variant="danger"
            @click="removeStage(index)"
          ><i
            class="fas fa-times mr-2"
          />删除此阶段</b-button>
        </b-card>
      </div>
      <div v-if="newFlow.stageList.length === 0">请添加阶段</div>
      <b-button
        class="w-100"
        size="sm"
        variant="primary"
        @click="addStage()"
      ><i
        class="fas fa-plus mr-2"
      />添加阶段</b-button>
    </b-form-group>

    <b-form-group label="阶段可演进关系:">
      <b-table
        v-if="newFlow.stageList.length !== 0"
        small
        :fields="evolutionTable.fields"
        :items="evolutionTable.items"
        class="text-center"
      >
        <template
          v-for="(field, index) in evolutionTable.items"
          v-slot:[`cell(${field.index})`]="data"
        >
          <b-form-checkbox
            v-if="newFlow.evolution.length !== 0"
            switch
            :key="index"
            v-model="newFlow.evolution[data.index][index]"
          >
          </b-form-checkbox>
        </template>
      </b-table>
      <div v-if="newFlow.stageList.length === 0">请添加阶段</div>
    </b-form-group>
    <b-button class="mt-3" variant="success" block @click="createFlow()">确认创建此流程</b-button>
    <!-- .<b-button class="mt-2" variant="warning" block @click="hideCreateFlowModal()">关闭并清除填入信息</b-button> -->
  </div>
</template>

<script>
export default {
  props: {
    projectId: String,
    flowSelector: Array,
  },
  data() {
    return {
      newFlow: {
				name: '',
				parentId: null,
				stageList: [],
				evolution: []
			},
    }
  },
  watch: {
    'newFlow.stageList'() {
			this.newFlow.evolution = this.newFlow.stageList.map(() => {
				return this.newFlow.stageList.map(() => {
					return true;
				});
			});

			const evolutionTable = {
				fields: [
					{ key: 'index', label: '' }
				],
				items: []
			};
			this.newFlow.stageList. forEach((stage, index) => {
				evolutionTable.fields.push({ key: String(index + 1), value: String(index + 1) });
				evolutionTable.items.push({ index: String(index + 1) });
			});

			this.evolutionTable = evolutionTable;
		},
  },
  methods: {
		addStage() {
			this.newFlow.stageList.push({
				name: '',
				promoted: true,
				initializable: true,
				plugins: []
			});
		},
		removeStage(stageIndex) {
			this.newFlow.stageList.splice(stageIndex, 1);
		},
		async createFlow() {
			if (this.flowSelector.length === 0) {
				this.newFlow.parentId = null;
			}
			
			try {
				await this.$http.project.flow(this.projectId).create(this.newFlow);
				this.showToast('success', '添加成功');
				this.$emit('queryFlowList');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '添加失败');
			}
		},
  }
}
</script>

<style>

</style>