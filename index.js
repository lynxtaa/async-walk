const {join} = require('path')
const prWrap = require('pr-wrap')
const fs = prWrap.all(require('fs'))

const pathInfo = path => fs.stat(path)
	.then(stats => ({ path, isDir: stats.isDirectory() }))

const readdir = path => fs.readdir(path)
	.then( contents => contents.map(filename => join(path, filename)) )

module.exports = function walk(path) {
	return readdir(path)
		.then(contents => Promise.all( contents.map(pathInfo) ))
		.then(pathInfoArr => {
			const folders = []
			const files = []

			pathInfoArr.forEach(({isDir, path}) => {
				(isDir ? folders : files).push(path)
			})

			return Promise
				.all(folders.map(walk))
				.then(results => files.concat(...results))
		})
}
