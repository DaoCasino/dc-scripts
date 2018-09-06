const fs      = require('fs')
const ora     = require('ora')
const path    = require('path')
const chalk   = require('chalk')
const _config = require('../workflow.config.json')

const spinner = ora('uninstall protocol...')

function clearConfig (_config) {
  _config.protocolDir = ''

  const openConfig = fs.openSync(path.join(__dirname, '../workflow.config.json'), 'w')
  fs.writeSync(openConfig, JSON.stringify(_config, null, ' '), 0, 'utf-8')  
}

function rmFolder (path) {
  try {
    fs.readdirSync(path).forEach(file => {
      const curPath = path + '/' + file
      
      if (typeof curPath !== 'undefined') {
        (fs.lstatSync(curPath).isDirectory())
          ? rmFolder(curPath)
          : fs.unlinkSync(curPath)
      } 
    })

    fs.rmdirSync(path)
  } catch (err) {
    spinner.fail('uninstall fail')
    console.error(chalk.red(err))
    process.exit()
  }
}

module.exports = cmd => {
  const targetDir = _config.protocolDir
  
  clearConfig(_config)

  if (typeof targetDir === 'undefined' || targetDir === '') {
    console.error(chalk.red('Error: no protocol path'))
    process.exit()
  }

  if (!fs.existsSync(targetDir)) {
    console.error(chalk.red('Error: protocol directory undefined'))
    process.exit()
  }
  
  spinner.start()
  
  rmFolder(targetDir)
  spinner.succeed('uninstall complete')
}