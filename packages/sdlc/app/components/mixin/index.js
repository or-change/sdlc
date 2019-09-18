const minix = {
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
};

export default minix;