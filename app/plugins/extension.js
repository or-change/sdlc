import * as extension from '../register';

export default function install(Vue) {
	Vue.prototype.$extension = extension.store;
}