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
				<b-form-group :label="$t('product.name')">
					<b-input
						readonly
						size="sm"
						:value="product.name"
					></b-input>
				</b-form-group>
			</b-col>
			<b-col cols="3">
				<b-form-group :label="$t('product.version')">
					<b-input
						readonly
						size="sm"
						:value="product.version"
					></b-input>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group :label="$t('product.description')">
					<b-input
						readonly
						size="sm"
						:value="product.description"
					></b-input>
				</b-form-group>
			</b-col>
		</b-row>

		<h4 class="my-3">{{ $t('product.plugin') }}</h4>
		<b-table
			small
			striped
			:fields="[
				{ key: 'name', label: $t('product.name') },
				{ key: 'action', label: $t('product.action') }
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