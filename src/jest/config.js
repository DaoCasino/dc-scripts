const path = require('path')

module.exports = {
  rootDir: process.cwd(),
  roots: ['src', 'lib', 'daap', 'test'],
  reporters: [path.resolve(__dirname, 'reporter.js')],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageDirectory: 'test/coverage',
  coverageReporters: ['json'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'src/**/*.js',
    'dapp/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  verbose: false,
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'setup.js')
}