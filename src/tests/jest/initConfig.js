module.exports = (process.env.TARGET_TEST !== 'integration') 
  ? require('./config/unit')
  : require('./config/integration')