const fs    = require('fs')
const path  = require('path')
const Utils = require('./utils')
const upENV = require('./upEnv')

module.exports = async params => {
  /** Init params */
  const NETWORK            = params.network || 'local'
  const SERVECE_NAME       = params.service  || ((params.protocol) ? 'dc_protocol' : ' ')
  const PATH_PROTOCOL      = path.join(__dirname, '../_env/protocol')
  const PATH_CONTRACT      = path.join(__dirname, '../_env/protocol', 'dapp.contract.json')
  const PATH_PROTOCOL_ADDR = path.join(__dirname, '../_env/protocol', 'addresses.json')
  
  if (params.sdk) {
    process.env.DAPP_ROOM = Utils.UUID()
  }

  /** Start env for developing with params options */
  try {
    /** Check docker init on machine */
    await Utils.startingCliCommand(
      `${Utils.sudo()} sh ./_scripts/check_docker.sh`,
      path.join(__dirname, '../_env')
    )
    /**
     * Check exists and status "start"
     * docker container
     */
    await Utils.checkDockerContainer('dc_protocol')
      .then(async status => {
        /**
         * Copy protocol directory from 
         * docker container in _env directory
         * if not exists protocol directory
         * in docker container catch error
         * and return
         */
        try {
          await Utils.startingCliCommand(
            `${Utils.sudo()} docker cp dc_protocol:/protocol/ ./`,
            path.join(__dirname, '../_env')
          )
        } catch (err) {
          console.log('No such file dc_protocol:/protocol/')
        }

        /**
         * if status false or not exists
         * addresses.json in protocol 
         * directory or params.force option
         * is true then start ENV
         */
        switch (false) {
          case status:
            /** 
             * If Protocol directory exists
             * then remove protocol directory
             */
            (fs.existsSync(PATH_PROTOCOL)) && await Utils.rmFolder(PATH_PROTOCOL);
            await upENV({ service: SERVECE_NAME, recreate: '--no-recreate' })
            break
          case fs.existsSync(PATH_PROTOCOL_ADDR):
            await upENV({ service: SERVECE_NAME, recreate: '--force-recreate' })
            break
          case !params.force:
            await upENV({ service: SERVECE_NAME, recreate: '--force-recreate' })
          default:
            break
        }
      })

    /** 
     * Check env SDK with --sdk option
     * and copy contracts protocol and not 
     * inner migrate
     */
    if (params.sdk) {
      await Utils.copyContracts(path.join(process.cwd(), 'dapp/config'))
      return true
    }

    /**
     * if contract file not exists or
     * network not equal contract network or
     * --force option exist start deploy contract with network
     */
    if (!fs.existsSync(PATH_CONTRACT) || require(PATH_CONTRACT).network !== NETWORK || params.force) {
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
      console.log('Contracts copy finished')
      return true
    }

    /** Init directory path with params of cwd env path */
    const DCLIB_DIR      = params.dclibPath      || path.join(process.cwd(), '..', 'dclib')
    const BANKROLLER_DIR = params.bankrollerPath || path.join(process.cwd(), '..', 'bankroller_core');
    /**
      * If pathToProjectJSON not exists then
      * check dclib directory in env PWD and copy
      * inner contraacts directory
      */
    (fs.existsSync(DCLIB_DIR))
      ? await Utils.copyContracts(path.join(DCLIB_DIR, 'protocol'))
      : console.info('DClib directory not exist with path', DCLIB_DIR);

    /**
      * If pfthToProjectJSON not exists then
      * check bankroller_core directory in env PWD and copy
      * inner contracts directory
      */
    (fs.existsSync(BANKROLLER_DIR))
      ? await Utils.copyContracts(path.join(BANKROLLER_DIR, 'protocol'))
      : console.info('Bankroller directory not exist with path', BANKROLLER_DIR);
    
    return true
  } catch (err) {
    console.error('Error with code: ', err)
    process.exit(1)
  }
}
