import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zh from './langs/zh.yaml';
import en from './langs/en.yaml';

Vue.use(VueI18n);

const messages = { zh, en };

export default new VueI18n({
	locale: 'zh',
	messages
});

