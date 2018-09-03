const fs          = require('fs')
const ora         = require('ora')
const chalk       = require('chalk')
const protocolDir = require('../workflow.config.json').protocolDir

const spinner = ora('uninstall protocol...')

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
  if (typeof protocolDir === 'undefined' || protocolDir === '') {
    console.error(chalk.red('Error: no protocol path'))
    process.exit()
  }

  if (!fs.existsSync(protocolDir)) {
    console.error(chalk.red('Error: protocol directory undefined'))
    process.exit()
  }
  
  spinner.start()
  
  rmFolder(protocolDir)
  spinner.succeed('uninstall complete')
}