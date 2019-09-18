<template>
	
<div class="custom-number">{{value||'N/A'}}</div>

</template>

<script>
export default {
	name: 'custom-number',
	props: ['value'],
}
</script>

<style lang="scss">
.custom-number {
	font-size: 108px;
	text-align: center;
	font-weight: 500;
}
</style>
