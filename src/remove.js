const fs      = require('fs')
const ora     = require('ora')
const path    = require('path')
const chalk   = require('chalk')
const _config = require('./config/config.json')

/**
 * init a cli spinner
 */
const spinner = ora('uninstall protocol...')

/**
 * clear projects directory path
 * and update config.json file
 */
function clearConfig (_config) {
  _config.projectsDir = ''

  const openConfig = fs.openSync(path.join(__dirname, './config/config.json'), 'w')
  fs.writeSync(openConfig, JSON.stringify(_config, null, ' '), 0, 'utf-8')  
}

function rmFolder (path) {
  try {
    /**
     * check files in directory
     * and call functions for each of them
     */
    fs.readdirSync(path).forEach(file => {
      /**
       * path to target file
       */
      const curPath = path + '/' + file
      
      /**
       * check availability file and
       * check isDirectory after delete this or recursive call
       */
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

module.exports = function () {
  /**
   * init path to projects directory
   */
  const deletePath = _config.projectsDir

  /**
   * Check config on availability
   * path to projects directory
   */
  if (typeof deletePath === 'undefined' || deletePath === '') {
    console.error(chalk.red('Error: no protocol path'))
    process.exit()
  }

  /**
   * clear path in a config
   */
  clearConfig(_config)

  /**
   * Check availability directory with path
   */
  if (!fs.existsSync(deletePath)) {
    console.error(chalk.red('Error: protocol directory undefined'))
    process.exit()
  }
  
  /**
   * Delete directory with path
   */
  spinner.start()
  rmFolder(deletePath)
  spinner.succeed('uninstall complete')
}