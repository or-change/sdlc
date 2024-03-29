export default function install(Vue) {
	Vue.mixin({
		methods: {
			showToast(variant, content) {
				this.$bvToast.toast(content, {
					title: null,
					variant: variant,
					toaster: 'b-toaster-top-center',
					autoHideDelay: 2000,
					noCloseButton: true,
					solid: true
				});
			}
		}
	});
}