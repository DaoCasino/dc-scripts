module.exports = (process.env.TARGET_TEST === 'integration') 
  ? require('../../config/jest/integration')
  : require('../../config/jest/unit')