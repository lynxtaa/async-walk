const {expect} = require('chai')
const {join} = require('path')
const asyncWalk = require('../index')

const testPath = join(__dirname, 'test-folder')

describe('Test recursive walking', () => {
	it('returns array of files', done => {
		const expected = [
			join(testPath, 'file1'),
			join(testPath, 'file2'),
			join(testPath, 'inner-folder', 'file3'),
		]

		asyncWalk(testPath)
			.then(files => {
				expect(files).to.have.members(expected)
				done()
			})
			.catch(done)
	})

	it('throws error for invalid path ', done => {
		asyncWalk('invalid')
			.then(done)
			.catch(err => {
				expect(err).to.be.an('error')
				done()
			})
	})
})
