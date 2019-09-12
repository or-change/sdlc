<template>
  <div>
    <b-row>
      <b-col cols="3">
        <b-form-group label="请选择版本:">
          <b-form-select 
            v-model="versionSelected.id" 
            :options="versionSelector" 
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col cols="3">
        <b-form-group label="创建时间:">
          <b-form-input 
            :value="versionSelected.createdAt | dateFormat" 
            size="sm" 
            readonly
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group label="版本简介:">
          <b-form-textarea 
						rows="3"
						no-resize
						size="sm" 
						v-model="versionSelected.abstract"
					></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <b-button
          class="w-100"
          size="sm"
          variant="info"
          @click="showCreateVersionModal()"
        ><i
          class="fas fa-plus mr-2"
        />添加新版本</b-button>
      </b-col>
      <b-col cols="2">
        <b-button
          class="w-100"
          size="sm"
          variant="success"
          @click="updateVersion"
        ><i
          class="fas fa-check mr-2"
        />更新版本信息</b-button>
      </b-col>
      <!-- <b-col cols="2">
        <b-button
          class="w-100"
          size="sm"
          variant="danger"
          @click="deleteVersion"
        ><i
          class="fas fa-times mr-2"
        />删除当前版本</b-button>
      </b-col> -->
    </b-row>

    <b-modal ref="create-version-modal" hide-footer title="创建新版本">
      <div>
        <b-form-group label="版本号: (格式: 1.0.0)">
					<b-form-input 
            size="sm" 
            v-model="newVersion.semver" 
            :state="semverState"
          ></b-form-input>
				</b-form-group>
        <b-form-group label="版本简介:">
					<b-form-textarea 
						rows="3"
						no-resize
						size="sm" 
						v-model='newVersion.abstract'
            :state="abstractStage"
					></b-form-textarea>
				</b-form-group>
      </div>
      <b-button 
        class="mt-3" 
        variant="primary" 
        block 
        @click="createVersion" 
        :disabled="!semverState || !abstractStage"
      >确认创建版本</b-button>
      <b-button 
        class="mt-2" 
        variant="warning" 
        block 
        @click="hideCreateVersionModal()"
      >关闭并清除填入信息</b-button>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    projectId: String
  },
  data() {
    return {
      versionList: [],
      versionSelector: [],
      versionSelected: {
        id: '',
        createdAt: '',
        abstract: ''
      },
      newVersion: {
        semver: '',
        abstract: ''
      }
    }
  },
  computed: {
    semverState() {
      return this.newVersion.semver.length > 0;
    },
    abstractStage() {
      return this.newVersion.abstract.length > 0;
    }
  },
  watch: {
    'versionSelected.id'() {
      const { semver, createdAt, abstract } = this.versionList.find(version => {
        return version.id === this.versionSelected.id;
      });

      this.versionSelected.semver = semver;
      this.versionSelected.createdAt = createdAt;
      this.versionSelected.abstract = abstract;
    }
  },
  mounted() {
    this.queryVersionList();
  },
  methods: {
    async queryVersionList() {
      const versionList = await this.$http.project.version(this.projectId).query();

      this.versionList = versionList.sort((versionA, versionB) => {
        return versionA.semver.replace(/\./g, '') - versionB.semver.replace(/\./g, '');
      });

      this.versionSelected.id = versionList[0].id;

      this.versionSelector = [];
      versionList.forEach(version => {
        this.versionSelector.push({
          value: version.id,
          text: `v${version.semver}`
        })
      });
    },
    async createVersion() {
      try {
        await this.$http.project.version(this.projectId).create(this.newVersion);
        this.$bvToast.toast('添加成功', {
          title: null,
          variant: 'success',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
        this.hideCreateVersionModal();
        this.queryVersionList();
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('添加失败', {
          title: null,
          variant: 'danger',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
      }

    },
    async updateVersion() {
      try {
        await this.$http.project.version(this.projectId).update(this.versionSelected.id, {
          abstract: this.versionSelected.abstract
        });
        this.$bvToast.toast('更新成功', {
          title: null,
          variant: 'success',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
      } catch (error) {
        console.log(error);
        this.$bvToast.toast('更新失败', {
          title: null,
          variant: 'danger',
          toaster: 'b-toaster-top-center',
          autoHideDelay: 2000,
          noCloseButton: true,
          solid: true
        });
      }

    },
    showCreateVersionModal() {
      this.$refs['create-version-modal'].show();
    },
    hideCreateVersionModal() {
      this.$refs['create-version-modal'].hide();
      this.newVersion = {
        semver: '',
        abstract: ''
      }
    }
  }
}
</script>

<style>

</style>