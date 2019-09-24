<template>
	<div class="detail-member">
		<h5 class="mb-3">已加入:</h5>
		<b-table
			v-if="accountList.length !== 0"
			small
			striped
			hover
			sticky-header
			:fields="[
				{ key: 'name', label: '姓名' },
				{ key: 'inviter', label: '邀请者' },
				{ key: 'joinedAt', label: '加入时间' },
				{ key: 'action', label: '操作' }
			]"
			:items="memberList"
			class="member-list text-center"
		>
			<template
				v-slot:cell(name)="data"
			>{{ accountList.find(account => account.id === data.item.accountId).name }}</template>
			<template
				v-slot:cell(inviter)="data"
			>{{ accountList.find(account => account.id === data.item.inviter).name }}</template>
			<template
				v-slot:cell(joinedAt)="data"
			>{{ data.item.joinedAt | dateFormat }}</template>
			<template v-slot:cell(action)="data">
				<b-button
					size="sm"
					variant="link"
					@click="deleteMember(data.item.id)"
				>移除</b-button>
			</template>
		</b-table>

		<h5 class="mb-3">未加入:</h5>
		<b-row>
			<b-col cols="4">
				<b-form-group
					label="搜索:"
					label-cols-sm="3"
					label-size="sm"
				>
					<b-form-input
						size="sm"
						v-model="accountFilter"
						type="search"
						placeholder="姓名"
					></b-form-input>
				</b-form-group>
			</b-col>
		</b-row>
		<b-table
			small
			striped
			hover
			sticky-header
			:fields="[
				{ key: 'name', label: '姓名' },
				{ key: 'action', label: '操作' }
			]"
			:items="accountNotMember"
			:filter="accountFilter"
			class="account-list text-center"
		>
			<template v-slot:cell(action)="data">
				<b-button
					size="sm"
					variant="link"
					@click="createMember(data.item.id)"
				>添加</b-button>
			</template>
		</b-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			projectOwner: null,
			accountList: [],
			memberList: [],
			accountFilter: null
		};
	},
	computed: {
		projectId() {
			return this.$route.params.projectId;
		},
		principalId() {
			return this.$store.state.principal.id;
		},
		accountNotMember() {
			return this.accountList.filter(account => {
				return !(this.memberList.find(member => account.id === member.accountId)
					|| account.id === this.projectOwner);
			});
		}
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
		async createMember(id) {
			try {
				await this.$http.project.member(this.projectId).create({
					accountId: id,
					inviter: this.principalId
				});
				this.queryMemberList();
				this.showToast('success', '添加成功');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '添加失败');
			}
		},
		async deleteMember(id) {
			try {
				await this.$http.project.member(this.projectId).delete(id);
				this.queryMemberList();
				this.showToast('success', '移除成功');
			} catch (error) {
				console.log(error);
				this.showToast('danger', '移除失败');
			}
		}
	}
};
</script>

<style lang="scss">
.detail-member {
	.member-list {
		th {
			width: 25%;
		}
		td {
			width: 25%;
		}
	}
	.account-list {
		th {
			width: 50%;
		}
		td {
			width: 50%;
		}
	}
}
</style>