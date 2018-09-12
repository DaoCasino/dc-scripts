const path = require('path')

module.exports = {
  bail: true,
  rootDir: process.cwd(),
  roots: [
    '<rootDir>/src',
    '<rootDir>/lib',
    '<rootDir>/daap',
    '<rootDir>/test'
  ],
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
  setupTestFrameworkScriptFile: path.resolve(__dirname, '../../jest/setup.js')
}