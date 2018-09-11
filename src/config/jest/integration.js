const path = require('path')

module.exports = {
  rootDir: path.join(process.cwd(), './src/__tests__'),
  reporters: [path.join(__dirname, '../../jest/reporter.js')],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: path.join(__dirname, '../../jest/setup.js')
}