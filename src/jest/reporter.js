const ora        = require('ora')
const logSymbols = require('log-symbols');

class Reporter {
  constructor(_config, _options) {
    this.ora      = ora('Testing...')
    this._config  = _config
    this._options = _options
    this.succeed  = true
  }

  onRunStart() { this.ora.start() }
  
  onRunComplete(test, results) {
    (this.succeed)
      ? this.ora.succeed('Full test success')
      : this.ora.fail('Test not success with Error')
    
    results.testResults.forEach(result => (result.failureMessage !== null) &&
      console.log(result.failureMessage))
  }
  
  onTestResult(test, res) {
    const TestName = res.testResults[0].fullName
    let resultDot = ''
    
    this.ora.info('Result: ' + TestName)
    
    for (let result of res.testResults) {
      if (result.status === 'passed') {
        resultDot += `${logSymbols.success} `
      }

      if (result.status === 'failed') {
        resultDot += `${logSymbols.error} `
        this.succeed = false
      }
    }

    console.log(resultDot)
    this.ora.start()
  }
}

module.exports = Reporter;