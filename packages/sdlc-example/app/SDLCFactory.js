export default function (Decorator) {
	Decorator.sdlc.pluginExtender.appendRoutes([{
		path: '/',
		redirect: 'workbench'
	}]);
}