import Number from './Number';
import ProjectVersion from './ProjectVersion';

export default function install(Vue) {
	Vue.component('custom-number', Number);
	Vue.component('custom-project-version', ProjectVersion);
}