<template>
	<div class="detail-member">
		<b-row>
			<b-col>
				<b-row>
					<b-col>
						<h5 class="mb-3">{{ $t('member.joined.title') }}</h5>
					</b-col>
					<b-col cols="5">
						<b-form-group
							:label="$t('member.search')"
							label-cols-sm="3"
							label-size="sm"
						>
							<b-form-input
								size="sm"
								v-model="memberFilter"
								type="search"
							></b-form-input>
						</b-form-group>
					</b-col>
				</b-row>
				<b-table
					v-if="accountList.length !== 0"
					small
					striped
					hover
					sticky-header
					:fields="[
						{ key: 'name', label: $t('member.joined.name') },
						{ key: 'inviter', label: $t('member.joined.inviter') },
						{ key: 'joinedAt', label: $t('member.joined.joinedAt') },
						{ key: 'action', label: $t('member.joined.action') }
					]"
					:items="memberRenderList"
					:filter="memberFilter"
					class="member-list text-center"
				>
					<template
						v-slot:cell(joinedAt)="data"
					>{{ data.item.joinedAt | dateFormat }}</template>
					<template v-slot:cell(action)="data">
						<b-button
							size="sm"
							variant="link"
							@click="deleteMember(data.item.id)"
						>{{ $t('member.joined.remove') }}</b-button>
					</template>
				</b-table>
			</b-col>
			<b-col>

				<b-row>
					<b-col>
						<h5 class="mb-3">{{ $t('member.notToJoin.title') }}</h5>
					</b-col>
					<b-col cols="5">
						<b-form-group
							:label="$t('member.search')"
							label-cols-sm="3"
							label-size="sm"
						>
							<b-form-input
								size="sm"
								v-model="accountFilter"
								type="search"
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
						{ key: 'name', label: $t('member.notToJoin.name') },
						{ key: 'action', label: $t('member.notToJoin.action') }
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
						>{{ $t('member.notToJoin.add') }}</b-button>
					</template>
				</b-table>
			</b-col>
		</b-row>

	</div>
</template>

<script>
export default {
	data() {
		return {
			projectOwner: null,
			accountList: [],
			memberList: [],
			memberFilter: null,
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
		},
		memberRenderList() {
			return this.memberList.map(member => {
				return {
					id: member.id,
					name: this.accountList.find(account => account.id === member.accountId).name,
					inviter: this.accountList.find(account => account.id === member.inviter).name,
					joinedAt: member.joinedAt,
					exitedAt: member.exitedAt
				};
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
			const memberList = await this.$http.project.member(this.projectId).query();
			this.memberList = memberList.reverse();
			// console.log(this.memberList);
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
				this.showToast('success', this.$t('member.notToJoin.success'));
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('member.notToJoin.failed'));
			}
		},
		async deleteMember(id) {
			try {
				await this.$http.project.member(this.projectId).delete(id);
				this.queryMemberList();
				this.showToast('success', this.$t('member.joined.success'));
			} catch (error) {
				console.log(error);
				this.showToast('danger', this.$t('member.join.failed'));
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