const path = require('path')

module.exports = {
  rootDir: path.join(process.cwd(), './src'),
  roots: ['<rootDir>/__tests__'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: path.join(__dirname, '../../jest/setup.js')
}