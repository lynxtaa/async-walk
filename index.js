const fs = require('fs')
const _path = require('path')

const promisify = fn => (...args) => new Promise((resolve, reject) => {
	args.push((err, data) => err ? reject(err) : resolve(data))
	fn(...args)
})

const pathInfo = path => promisify(fs.stat)(path)
	.then(stats => ({ path, isDir: stats.isDirectory() }))

const readdir = path => promisify(fs.readdir)(path)
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
