const EventEmitter = require('events');

module.exports = function Channel(EVENTS) {
	const eventEmitter = new EventEmitter();

	return {
		get list() {
			const channels = {};

			Object.keys(EVENTS).forEach(eventName => {
				channels[eventName] = EVENTS[eventName].map(item => item);
			});

			return channels;
		},
		emit(eventName, arg) {
			if (!EVENTS[eventName]) {
				throw new Error(`Event ${eventName} is not registered.`);
			}

			eventEmitter.emit(eventName, arg);
		},
		on(eventName, callback) {
			eventEmitter.on(eventName, callback);
		}
	};
};