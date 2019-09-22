<template>
	<div>
		<b-card class="mb-3">
			<div v-if="memberList.length === 0">无</div>
			<div
				v-if="memberList.length !== 0 && accountList.length !== 0"
				v-for="(member, index) in memberList"
				:key="index"
				class="mr-3"
				style="display:inline-block;"
			>{{ accountList.find(account => account.id === member.accountId).name }}</div>
		</b-card>
		<b-row>
			<b-col cols="2">
				<b-button
					class="w-100"
					size="sm"
					variant="primary"
					@click="showMemberSetting()"
				><i
					class="fas fa-cog mr-2"
				/>成员管理</b-button>
			</b-col>
		</b-row>

		<b-modal ref="member-setting-modal" hide-footer title="成员管理">
			<MemberSetting
				:projectId="projectId"
				:memberList="memberList"
				:accountList="accountList"
				:projectOwner="projectOwner"
				@queryMemberList="queryMemberList"
			></MemberSetting>
		</b-modal>
	</div>
</template>

<script>
import MemberSetting from './MemberSetting';

export default {
	components: {
		MemberSetting
	},
	data() {
		return {
			projectOwner: null,
			accountList: [],
			memberList: [],
			accountFilter: null,
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
	},
	mounted() {
		this.queryMemberList();
		this.queryAccountList();
		this.getProjectById();
	},
	methods: {
		async queryMemberList() {
			this.memberList = await this.$http.project.member(this.projectId).query();
		},
		async queryAccountList() {
			this.accountList = await this.$http.account.query();
		},
		async getProjectById() {
			const project = await this.$http.project.get(this.projectId);
			this.projectOwner = project.ownerId;
		},
		
		showMemberSetting() {
			this.$refs['member-setting-modal'].show();
		}
	}
};
</script>

<style>

</style>