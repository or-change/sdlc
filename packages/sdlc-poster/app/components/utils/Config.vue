<template>
	<b-container fluid>
		<b-row>
			<b-form-group
				label="可通知事件"
			>
				<b-form-checkbox-group
					v-model="config.events"
					:options="options.events"
					size="sm"
				></b-form-checkbox-group>
			</b-form-group>
		</b-row>
		<b-row v-if="admin || owner">
			<b-form-group
				label="项目首选项"
			>
				<b-form-checkbox-group
					v-model="config.projectPreferences"
					:options="options.project"
					stacked
					size="sm"
				></b-form-checkbox-group>
			</b-form-group>
		</b-row>
		<b-row>
			<b-form-group
				label="通知方式"
			>
				<b-form-checkbox-group
					v-model="config.informedMethods"
					:options="options.methods"
					size="sm"
				></b-form-checkbox-group>
			</b-form-group>
		</b-row>
	</b-container>
</template>

<script>

export default {
	name: 'default-config',
	props: {
		options: {
			type: Object,
			default: null,
		},
		config: {
			type: Object,
			default: null
		},
		admin: {
			type: Boolean,
			default: false
		},
		owner: {
			type: Boolean,
			default: false
		}
	}
};
</script>