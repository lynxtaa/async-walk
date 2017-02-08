const _path = require('path')
const promisify = require('promisify')
const fs = promisify.all(require('fs'))

const pathInfo = path => fs.stat(path)
	.then(stats => ({ path, isDir: stats.isDirectory() }))

const readdir = path => fs.readdir(path)
	.then( contents => contents.map(filename => _path.join(path, filename)) )

module.exports = function(path) {
	const results = []

	return (function walk(path) {
		return readdir(path)
			.then(contents => Promise.all( contents.map(path => pathInfo(path)) ))
			.then(pathInfoArr => {
				const files = pathInfoArr.filter(({isDir}) => !isDir).map(({path}) => path)
				const folders = pathInfoArr.filter(({isDir}) => isDir).map(({path}) => path)

				results.push(...files)

				return Promise.all(folders.map(path => walk(path)))
			})
	}(path)).then(() => results)
}
