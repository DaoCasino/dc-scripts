const fs    = require('fs')
const path  = require('path')
const Utils = require('./utils')
const upENV = require('./upEnv')

module.exports = async cmd => {
  const NETWORK      = (cmd.ropsten)  ? 'ropsten'          : 'local'
  const RECREATE     = (cmd.force)    ? '--force-recreate' :  '--no-recreate'
  const SERVECE_NAME = (cmd.protocol) ? 'dc_protocol'      : ' '

  /**
   * Start env for developing with cmd options
   */
  try {
    /**
     * Check exists and status "start"
     * docker container
     */
    await Utils.checkDockerContainer('dc_protocol')
      .then(async status => {
        /**
         * If status true and network not equal ropsten
         * or cmd options --force exists then
         * up docker containers
         */
        ((!status && NETWORK !== 'ropsten') || cmd.force) &&
          await upENV({ service: SERVECE_NAME, recreate: RECREATE }) 
      })
    
    /** init path and contract network */
    const pathToContract  = path.join(__dirname, '../_env/protocol/dapp.contract.json')
    const contractNetwork = require(pathToContract).network

    /**
     * if contract file not exists or
     * network not equal contract network or
     * --force option exist start deploy contract with network
     */
    if (!fs.existsSync(pathToContract) || NETWORK !== contractNetwork || cmd.force) {
      await Utils.startingCliCommand(
        `${Utils.sudo()} npm run migrate:${NETWORK}`,
        path.join(__dirname, '../')
      )
    }

    /** Path to projects directory */
    const pathToProjectJSON = path.join(__dirname, '../pathToProject.json')
      
    /**
      * Check if pathToProject.json exist
      * then copy protocol folder of _env in 
      * dclib and bankroller_core
      */
    if (fs.existsSync(pathToProjectJSON)) {
      await Utils.copyContracts(path.join(require(pathToProjectJSON), 'bankroller_core/protocol'));
      await Utils.copyContracts(path.join(require(pathToProjectJSON), 'dclib/protocol'));
      return
    }

    /**
      * If pathToProjectJSON not exists then
      * check dclib directory in env PWD and copy
      * inner contraacts directory
      */
    (fs.existsSync(path.join(process.cwd(), '..', 'dclib'))) &&
      await Utils.copyContracts(path.join(process.cwd(), '..', 'dclib/protocol'));

    /**
      * If pfthToProjectJSON not exists then
      * check bankroller_core directory in env PWD and copy
      * inner contracts directory
      */
    (fs.existsSync(path.join(process.cwd(), '..', 'bankroller_core'))) &&
      await Utils.copyContracts(path.join(process.cwd(), '..', 'bankroller_core/protocol'))
  } catch (err) {
    console.error('Error with code: ', err)
    process.exit(1)
  }
}
