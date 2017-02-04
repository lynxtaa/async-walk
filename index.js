const _path = require('path')

const promisifyAll = (srcObj, ...methods) => methods.reduce((targetObj, method) => {
	targetObj[method] = (...args) => new Promise((resolve, reject) => {
			args.push((err, data) => err ? reject(err) : resolve(data))
			srcObj[method](...args)
		})
	return targetObj
}, {})

const fs = promisifyAll(require('fs'), 'stat', 'readdir')

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
