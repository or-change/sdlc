<template>
  <div>
    <b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item active>我的项目</b-breadcrumb-item>
		</b-breadcrumb>

    <h4 class="mb-3" style="font-weight:bold;color:#6772e5;">项目列表</h4>

    <div class="mb-3" style="position:relative;">
      <b-form-checkbox-group
        v-model="projectOwnerDisplay"
        :options="[
          { text: '我负责的', value: 'owner' },
          { text: '我参与的', value: 'member' }
        ]"
        name="project-owner"
        button-variant="primary"
        size="sm"
        buttons
      ></b-form-checkbox-group>

      <b-button
        size="sm"
        variant="info"
        class="ml-4"
        @click="showCreateProjectModal()"
      ><i
        class="fas fa-plus mr-2"
      />创建新项目</b-button>

      <b-pagination
        style="position:absolute;top:0;right:100px;"
        size="sm" 
        aria-controls="project-all"
        v-model="currentPage" 
        :total-rows="rows" 
        :per-page="perPage"
      ></b-pagination>
    </div>

    <b-table
			small
      striped 
      hover
			:fields="[
				{ key: 'name', label: '名称' },
				{ key: 'language', label: '开发语言' },
				{ key: 'createdAt', label: '创建时间' },
			]"
      id="project-all"
			:items="projectRenderList"
      :busy="isBusy"
			:per-page="perPage"
			:current-page="currentPage"
			class="text-center project-list"
		>
			<template v-slot:cell(name)="data">
				<b-link :href='`#/desktop/project/${data.item.id}`'>{{ data.item.name }}</b-link>
			</template>

			<template v-slot:cell(createdAt)="data">
				{{ data.item.createdAt | dateFormat }}
			</template>

      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
		</b-table>

    <!-- 创建新项目 -->
		<b-modal ref="create-project-modal" hide-footer title="创建新项目">
      <div>
        <b-form-group label="项目名称">
					<b-form-input 
            size="sm" 
            v-model="newProject.name" 
            :state="nameState"
          ></b-form-input>
				</b-form-group>
        <b-form-group label="开发语言">
					<b-form-input 
            size="sm" 
            v-model='newProject.language' 
            :state="languageStage"
          ></b-form-input>
				</b-form-group>
        <b-form-group label="项目简介">
					<b-form-textarea 
						rows="3"
						no-resize
						size="sm" 
						v-model='newProject.abstract'
            :state="abstractStage"
					></b-form-textarea>
				</b-form-group>
      </div>
      <b-button 
        class="mt-3" 
        variant="primary" 
        block 
        @click="createProject" 
        :disabled="!nameState || !languageStage || !abstractStage"
      >确认创建项目</b-button>
      <b-button 
        class="mt-2" 
        variant="warning" 
        block 
        @click="hideCreateProjectModal()"
      >关闭并清除填入信息</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projectList: [],
      isBusy: false,
      perPage: 15,
      currentPage: 1,
      projectOwnerDisplay: ['owner', 'member'],
      newProject: {
				name: '',
				ownerId: '',
				language: '',
				abstract: ''
			}
    }
  },
  computed: {
    principalId() {
      return this.$store.state.principal.id;
    },
    nameState() {
      return this.newProject.name.length > 0;
    },
    languageStage() {
      return this.newProject.language.length > 0;
    },
    abstractStage() {
      return this.newProject.abstract.length > 0;
    },
    projectRenderList() {
       const list = this.projectList.filter(project => {
        if (this.projectOwnerDisplay.length === 1 
          && this.projectOwnerDisplay[0] === 'owner') {
          return project.ownerId === this.principalId;
        } 
        else if (this.projectOwnerDisplay.length === 1 
          && this.projectOwnerDisplay[0] === 'member') {
          return project.ownerId !== this.principalId;
        } else if (this.projectOwnerDisplay.length === 0) {
          return false;
        }
        else {
          return true;
        }
      });

      return list.sort((projectA, projectB) => {
        return Date.parse(projectB.createdAt) - Date.parse(projectA.createdAt);
      });
    },
    rows() {
      return this.projectRenderList.length;
    }
  },
  mounted() {
		this.queryProjectList();
	},
  methods: {
    async queryProjectList() {
      this.isBusy = true;
      this.projectList = await this.$http.project.query();
      this.isBusy = false
		},
    async createProject() {
      this.newProject.ownerId =  this.principalId;
      try {
        await this.$http.project.create(this.newProject);
        this.showToast('success', '创建成功');
      } catch (error) {
        console.log(error);
				this.showToast('danger', '创建失败');				
      }
      this.hideCreateProjectModal();
      this.queryProjectList();
    },
    showCreateProjectModal() {
      this.$refs['create-project-modal'].show();
    },
    hideCreateProjectModal() {
      this.$refs['create-project-modal'].hide();
      this.newProject = {
				name: '',
				ownerId: '',
				language: '',
				abstract: ''
			}
    },
  }
}
</script>

<style lang="scss">
.project-list {
	td {
		width: 33.33%;
	}
}
</style>