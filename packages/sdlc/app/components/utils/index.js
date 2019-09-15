import Number from './Number';
import ProjectVersion from './ProjectVersion';
import ProjectMember from './ProjectMember.vue';

export default function install(Vue) {
	Vue.component('custom-number', Number);
	Vue.component('custom-project-version', ProjectVersion);
	Vue.component('custom-project-member', ProjectMember);
}