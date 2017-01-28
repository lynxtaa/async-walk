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

const walkDir = path => {
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

walkDir('D:\\Music')
	.then(console.log.bind(console))
	.catch(console.log.bind(console))