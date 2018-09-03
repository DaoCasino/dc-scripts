const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  roots: ['integration'],
  reporters: [path.resolve(__dirname, '../reporter.js')],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: path.resolve(__dirname, '../setup.js')
}