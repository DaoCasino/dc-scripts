const ncp   = require('ncp').ncp
const path  = require('path')
const chalk = require('chalk')

const browserConfig = {
  dumpio: true,
  handleSIGINT: false,
  rgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--enable-features=NetworkService'
  ],
  timeout: 0
}

function randomInteger (min, max) {
  return Math.round(
    min - 0.5 + Math.random() * (max - min + 1)
  )
}

 function copyContracts (target_path) {
  ncp(
    path.join(__dirname, '../_env/protocol'),
    target_path,
    err => {
      if (err) {
        console.error(err)
        process.exit()
      }
    }
  )
}

function exitOn (f) {
  [ 'SIGINT', 'SIGTERM', 'SIGBREAK' ]
    .forEach(SIGNAL => {    
      process.on(SIGNAL, () => {      
        console.log('')
        console.warn(chalk.yellow('WARNING: process out'))

        process.stdin = null
        f().then(() => process.exit(131))
      })
    })
}

module.exports.exit          = exitOn
module.exports.browserConfig = browserConfig
module.exports.copyContracts = copyContracts
module.exports.randomInteger = randomInteger