const jest = require('jest')
const path = require('path')

module.exports = function () {
  require('dotenv').config({path: path.resolve(__dirname, '../.testenv')})

  const argv = process.argv.slice(2)

  argv.push('--config', path.resolve(__dirname, 'jest', 'config.js'))
  jest.run(argv)
}
