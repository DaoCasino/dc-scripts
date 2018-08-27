const path = require('path')

module.exports = {
  rootDir: process.cwd(),
  roots: ['src', 'lib', 'daap', 'test'],
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    'src/**/*.js',
    'dapp/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
}