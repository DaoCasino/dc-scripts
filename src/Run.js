const fs      = require('fs')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')

module.exports = cmd => {
  const SERVECE_NAME = (cmd.protocol) ? 'dc_protocol' : ' '
  const RECREATE = (fs.existsSync(path.join(__dirname, '../_env/protocol')))
    ? '--no-recreate' : '--force-recreate'
  /**
   * Start env for developing with cmd options
   */
  upENV({ service: SERVECE_NAME, recreate: RECREATE })
    .then(async () => {
      /**
       * Path to projects directory
       */
      const pathToProjectJSON = path.join(__dirname, '../pathToProject.json')
      
      /**
       * Check if pathToProject.json exist
       * then copy protocol folder of _env in 
       * dclib and bankroller_core
       */
      if (fs.existsSync(pathToProjectJSON)) {
        await Utils.copyContracts(path.join(require(pathToProjectJSON), 'bankroller_core/protocol'))
        await Utils.copyContracts(path.join(require(pathToProjectJSON), 'dclib/protocol'))
      }
    })
    .catch(err => {
      console.error('Error with code: ', err)
      process.exit(1)
    })
}