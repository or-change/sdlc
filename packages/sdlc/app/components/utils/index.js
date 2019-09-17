import './StageTrack/wrap.scss';
import './StageTrack/tree.scss';

import StageTrackWrap from './StageTrack/Wrap';
import StageTrackTree from './StageTrack/Tree';

import CustomNumber from './Number';
import ProjectVersion from './ProjectVersion';
import ProjectMember from './ProjectMember';
import ProjectStageTrack from './StageTrack'

export default function install(Vue) {
	Vue.component('stage-track-wrap', StageTrackWrap);
	Vue.component('stage-track-tree', StageTrackTree);
	Vue.component('custom-number', CustomNumber);
	Vue.component('custom-project-version', ProjectVersion);
	Vue.component('custom-project-member', ProjectMember);
	Vue.component('custom-stage-track', ProjectStageTrack);
}