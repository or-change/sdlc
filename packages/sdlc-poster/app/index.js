import SDLC from 'sdlc';

SDLC.install('oc.com.or-change.poster', (extend) => {

	extend.addTopicItem({
		id: 'test-poster', label: 'poster',
		target: {
			id: 'test-topic', pluginId: 'oc.com.or-change.cn'
		},
		extend(test) {
			console.log(test);
		}
	});
});