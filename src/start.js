const fs      = require('fs')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const _config = require('./config/config')

module.exports = cmd => {
  /**
   * Start env for developing with cmd options
   */
  upENV({ service: (cmd.protocol) ? 'dc_protocol' : '', recreate: '--no-recreate' })
    .then(() => {
      const pathToProjectJSON = path.join(__dirname, '../pathToProject.json')

      if (fs.existsSync(pathToProjectJSON)) {
        for (let project of Object.keys(_config.repo)) {
          Utils.copyContracts(path.join(require(pathToProjectJSON), project, 'protocol'))
        }
      }
    })
    .catch(err => {
      console.error('Error with code: ', err)
      process.exit()
    })
}
