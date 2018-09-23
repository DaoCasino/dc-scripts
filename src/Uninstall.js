const fs    = require('fs')
const path  = require('path')
const chalk = require('chalk')
const Utils = require('./utils')

/**
 * init path to projects directory
 */
const deletePath = path.join(__dirname, '../pathToProject.json')

module.exports = function () {
  /**
   * Check config on availability
   * path to projects directory
   */
  if (!fs.existsSync(deletePath)) {
    console.error(chalk.red('Error: no protocol path file'))
    process.exit()
  }
  
  /**
   * Check availability directory with path
   */
  if (!fs.existsSync(require(deletePath))) {
    console.error(chalk.red('Error: protocol directory undefined'))
    
    fs.unlinkSync(deletePath)
    process.exit()
  }
  
  /**
   * Delete directory with path
   */
  Utils.rmFolder(require(deletePath))
  console.log(require(deletePath), 'deleted')

  /**
   * Delete file in which path to projects
   */
  fs.unlinkSync(deletePath)
}