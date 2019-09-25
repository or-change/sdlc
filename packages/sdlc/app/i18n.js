import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default function (extension) {
	const messages = {};

	Object.keys(extension).forEach(lang => {
		messages[lang] = Object.assign({}, ...extension[lang]);
	});

	console.log(extension);

	return new VueI18n({
		locale: 'zh',
		messages
	});
}

