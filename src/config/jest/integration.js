const path = require('path')

module.exports = {
  rootDir: path.join(__dirname, '../../tests'),
  roots: ['integration'],
  reporters: [path.join(__dirname, '../../tests/jest/reporter.js')],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: path.join(__dirname, '../../tests/jest/setup.js')
}