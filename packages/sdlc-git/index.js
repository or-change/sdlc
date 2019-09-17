
'use strict';

const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const fse = require('fs-extra');
const Git = require('nodegit');
const archiver = require('archiver');

module.exports = function gitPlugin() {
	return {
		id: 'com.orchage.sdlc.git',
		name: 'git',
		routers: {
			Plugin: (router) => {
				router.post('/git/clone', async ctx => {
					const { url } = ctx.request.body;
					const projectName = url.substring(url.lastIndexOf('/') + 1, url.length).replace('.git', '');
					const tempProjectName = projectName + '-' + Date.now();
					const tempPath = path.join(__dirname, `/store/temp/${tempProjectName}`);
					const finalPath = path.join(__dirname, `/store/zip/${projectName}.zip`);
					const directory = path.join(__dirname, `/store/zip/${tempProjectName}.zip`);
					const repository = await Git.Clone(url, tempPath);

					if (!repository) {
						return ctx.throw(500, 'Clone failed.');
					} else {
						const output = fs.createWriteStream(directory);
						const archive = archiver('zip', {
							zlib: {
								level: 9
							}
						});

						archive.pipe(output);
						archive.on('error', error => {
							console.log(error);
						});

						try {
							const compressDirectory = await fsPromises.readdir(tempPath);
	
							for (const fileName of compressDirectory) {
								const originalPath = path.join(tempPath, fileName);
								const stats = await fsPromises.stat(originalPath);
	
								if (stats.isDirectory()) {
									archive.directory(originalPath, fileName);
								}
	
								if (stats.isFile()) {
									archive.append(fs.createReadStream(originalPath), {
										name: fileName
									});
								}
							}
	
							await archive.finalize();
						
							await fse.remove(tempPath);
	
							const isExist = await fse.pathExists(finalPath);
	
							if (isExist) {
								await fse.remove(finalPath);
							}
	
							await fsPromises.rename(directory, finalPath);
						} catch (error) {
							if (error) {
								return ctx.throw(500, 'Compress failed.');
							}
						}

						ctx.body = 'download successfully!';
					}
				});
			}
		}
	};
};