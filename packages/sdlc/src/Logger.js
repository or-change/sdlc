module.exports = function () {
	injection.ServiceLogger =  Logger({
		format(meta, message) {
			return `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${message.type}${JSON.stringify(message.info)}`;
		}
	});
	injection.ExceptionLogger = Logger({
		appenders: [
			DuckLog.Appender.File({
				file: {
					size: 128 * 1024 * 1024
				}
			})
		]
	});
};