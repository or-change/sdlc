const DuckLog  = require('@or-change/duck-log');

module.exports = function Log(path) {
	const appenders = [
		DuckLog.Appender.Console()
	];

	if (path) {
		appenders.push(DuckLog.Appender.File({
			file: {
				pathname: path,//split
				size: 1024 * 1024
			}
		}));
	}

	return {
		access: {
			format: DuckLog.Format.ApacheCLF(),
			appenders
		},
		model: {
			format(meta, { type, info }) {
				return `[${meta.time.toISOString()}] [${meta.level.name.toUpperCase()}] [${meta.category}]: ${type} id: ${info}`;
			},
			appenders
		},
		authenticate: {
			appenders
		}
	};
};