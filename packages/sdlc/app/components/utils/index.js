import './StageTrack/wrap.scss';
import './StageTrack/tree.scss';

import CustomNumber from './Number';
import ProjectVersion from './ProjectVersion';
import ProjectMember from './ProjectMember.vue';
import StageTrackWrap from './StageTrack/Wrap.vue';
import StageTrackTree from './StageTrack/Tree.vue';

export default function install(Vue) {
	Vue.component('custom-number', CustomNumber);
	Vue.component('custom-project-version', ProjectVersion);
	Vue.component('custom-project-member', ProjectMember);
	Vue.component('stage-track-wrap', StageTrackWrap);
	Vue.component('stage-track-tree', StageTrackTree);
}