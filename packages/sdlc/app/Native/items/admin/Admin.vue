<template>
	<div>
		<b-breadcrumb>
			<b-breadcrumb-item to="/">
				<i class="fas fa-home"></i>
			</b-breadcrumb-item>
			<b-breadcrumb-item active>{{ $t('product.breadAccount') }}</b-breadcrumb-item>
			<b-breadcrumb-item active>{{ $t('product.breadProduct') }}</b-breadcrumb-item>
		</b-breadcrumb>

		<b-row>
			<b-col cols="3">
				<b-form-group label="名称:">
					<b-input
						readonly
						size="sm"
						:value="product.name"
					></b-input>
				</b-form-group>
			</b-col>
			<b-col cols="3">
				<b-form-group label="版本:">
					<b-input
						readonly
						size="sm"
						:value="product.version"
					></b-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group label="简述:">
					<b-input
						readonly
						size="sm"
						:value="product.description"
					></b-input>
				</b-form-group>
			</b-col>
		</b-row>

		<h4 class="my-3">插件</h4>
		<b-table
			small
			striped
			:fields="[
				{ key: 'name', label: '名称' },
				{ key: 'action', label: '操作' }
			]"
			:items="product.plugins"
			class="text-center plugins-list"
		>
			
		</b-table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			product: {}
		};
	},
	mounted() {
		this.getProduct();
	},
	methods: {
		async getProduct() {
			this.product = await this.$http.product.get();
		}
	}
};
</script>

<style>

</style>