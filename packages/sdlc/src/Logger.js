'use strict';

const DuckLog  = require('@or-change/duck-log');
const { Validator } = require('@or-change/duck');

function normalize(type, options) {
	Validator({
		type: 'object',
		additionalProperties: false,
		properties: {
			label: { type: 'string' },
			preventLevels: {
				type: 'array'
			},
			file: {
				type: 'object'
			}
		}
	})(options);

	const finalOptions = {
		label: type
	};

	const {
		label: _label = finalOptions.label,
		preventLevels: _preventLevels,
		file: _file
	} = options;

	finalOptions.label = _label;
	finalOptions.preventLevels = _preventLevels;
	finalOptions.file = _file;

	return finalOptions;
}

module.exports = function LoggerProvider({ Logger }) {
	return function LoggerFactory(type, options = {}) {
		const { label, preventLevels, file } = normalize(type, options);

		if (file) {
			return Logger({
				label, preventLevels,
				appenders: [
					DuckLog.Appender.File(file)
				]
			});
		}

		return Logger({ label, preventLevels });
	};
};