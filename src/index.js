const test    = require('./testRun')
const Utils   = require('./utils')
const upEnv   = require('./upEnv') 
const stopENV = require('./stopENV')

module.exports = Object.freeze({
  upENV              : upEnv,
  Utils              : Utils,
  stopENV            : stopENV,
  upTestENV          : test.upTestENV,
  runIntegrationTest : test.Integration
})
