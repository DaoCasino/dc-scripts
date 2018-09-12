const path = require('path')

module.exports = {
  bail: true,
  rootDir: process.cwd(),
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupTestFrameworkScriptFile: path.join(__dirname, '../../jest/setup.js')
}