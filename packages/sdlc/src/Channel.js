'use strict';

module.exports = function ChannelCenter(channelList) {
	const channels = {};
	const subscribes = {};

	function register(channelName) {
		if (channels[channelName]) {
			throw new Error(`Channel ${channelName} has registered.`);
		}

		channels[channelName] = true;
	}

	channelList.forEach(channelName => {
		register(channelName);
	});
	
	return function () {
		return {
			get channels() {
				return Object.keys(channels).map(channelName => channelName);
			},
			register,
			publish(channelName, arg) {
				if (!channels[channelName]) {
					throw new Error(`Channel ${channelName} is not registered.`);
				}
	
				if (subscribes[channelName]) {
					subscribes[channelName].forEach(callback => callback[arg]);
				}
			},
			subscribe(channelName, callback) {
				if (!channels[channelName]) {
					throw new Error(`Channel ${channelName} is not registered.`);
				}
	
				subscribes[channelName] = subscribes[channelName] ?
					subscribes[channelName].concat[callback] : [callback];
			}
		};
	};
};