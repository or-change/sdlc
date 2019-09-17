import dateFormat from 'dateformat';

function format(time) {
	if (!time) {
		return '-------------';
	}

	return dateFormat(time, 'yyyy/mm/dd');
}

export default function install(Vue) {
	Vue.filter('dateFormat', format);
}
