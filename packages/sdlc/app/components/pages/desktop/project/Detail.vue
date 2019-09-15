<template>
  <div>
    <b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item to="/desktop/project">我的项目</b-breadcrumb-item>
			<b-breadcrumb-item active></b-breadcrumb-item>
		</b-breadcrumb>

    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">项目属性</h4>
    <b-row>
      <b-col>
        <b-form-group label="项目名称:">
          <b-form-input trim size="sm" v-model="project.name"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="开发语言:">
          <b-form-input v-model="project.language" size="sm"></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="负责人:">
          <b-form-input :value="project.owner" size="sm" readonly></b-form-input>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="创建时间:">
          <b-form-input :value="project.createdAt | dateFormat" size="sm" readonly></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="项目简介:">
          <b-form-textarea 
						rows="3"
						no-resize
						size="sm" 
						v-model="project.abstract"
					></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mb-3">
      <b-col cols="2">
        <b-button
          class="w-100"
          size="sm"
          variant="success"
          @click="updateProject"
          :disabled="!projectNameState || !projectLanguageState || !projectAbstractState"
        ><i
          class="fas fa-check mr-2"
        />更新项目属性</b-button>
      </b-col>
      <b-col cols="2">
        <b-button
          class="w-100"
          size="sm"
          variant="danger"
          @click="deleteProject"
        ><i
          class="fas fa-times mr-2"
        />删除此项目</b-button>
      </b-col>
    </b-row>


    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">项目成员</h4>
    <custom-project-member 
      :projectId="projectId" 
      :projectOwner="project.owner"
      class="mb-3"
    ></custom-project-member>

    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">版本信息</h4>
    <custom-project-version :projectId="projectId" class="mb-3"></custom-project-version>

    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">阶段追踪</h4>

    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">版本详情</h4>

  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {
				name: '',
				owner: '',
				language: '',
        abstract: '',
        createdAt: null
      },
      versionList: [],
      accountList: []
    }
  },
  computed: {
    accountId() {
      return this.$store.state.principal.id;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    projectNameState() {
      return this.project.name.length > 0;
    },
    projectLanguageState() {
      return this.project.language.length > 0;
    },
    projectAbstractState() {
      return this.project.abstract.length > 0;
    }
  },
  mounted() {
    this.getProjectById();
  },
  methods: {
    async getProjectById() {
      const project = await this.$http.project.get(this.projectId);

      this.project.name = project.name;
      this.project.owner = project.ownerId;
      this.project.language = project.language;
      this.project.abstract = project.abstract;
      this.project.createdAt = project.createdAt;
      // console.log(project);
    },
    async updateProject() {
      try {
        await this.$http.project.update(this.projectId, {
          name: this.project.name,
          language: this.project.language,
          abstract: this.project.abstract
        });
        this.showToast('success', '更新成功');
      } catch (error) {
        console.log(error);
        this.showToast('danger', '更新失败');
      }
    },
    async deleteProject() {
      await this.$http.project.delete(this.projectId);
      this.$router.push('/desktop/project');
    },
    async createFlow() {

    },
    async queryFlowList() {
      const flowList = await this.$http.project.flow(this.projectId).query();
      // console.log(flowList);
      
    },
    async createTrace() {

    },
    async queryTraceList() {
      const traceList = await this.$http.project.trace(this.projectId).query();
      // console.log(traceList);
      
    }
  }
}
</script>

<style>

</style>