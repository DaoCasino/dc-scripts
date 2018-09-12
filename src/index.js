const test    = require('./testRun')
const Utils   = require('./Utils')
const upEnv   = require('./upEnv') 
const stopENV = require('./stopENV')

module.exports = Object.freeze({
  upENV              : upEnv,
  Utils              : Utils,
  stopENV            : stopENV,
  runIntegrationTest : test.Integration,
  runPerformanceTest : test.Performance,
})
