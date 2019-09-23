import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from './langs/zh.yaml';
import en from './langs/en.yaml';

Vue.use(VueI18n);

export default function (extension) {
	const messages = {};

	extension.zh = extension.zh.concat(zh);
	extension.en = extension.en.concat(en);

	Object.keys(extension).forEach(lang => {
		messages[lang] = Object.assign({}, ...extension[lang]);
	});

	console.log(extension);

	return new VueI18n({
		locale: 'zh',
		messages
	});
}

