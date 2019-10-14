const models = [
	require('./Asset'),
	require('./Group'),
	require('./Report'),
	require('./Task'),
	require('./UploadData')
];

module.exports = models.reduce((all, group) => Object.assign(all, group), {});