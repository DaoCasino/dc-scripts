const fs      = require('fs')
const jest    = require('jest')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const dotenv  = require('dotenv')
const stopENV = require('./stopENV')

function upTestENV(params) {
  return new Promise(async (resolve, reject) => {
    /**
     * Init params
     */
    const DC_LIB          = params.paths.dclib      || process.cwd()
    const DC_NETWORK      = params.network          || 'local'
    const TARGET_DAPP     = params.paths.targetDir  || path.join(process.cwd(), 'src/dapp')
    const BANKROLLER_CORE = params.paths.bankroller || process.cwd()
  
    /**
     * Check exist for paths
     */
    if (
      !fs.existsSync(DC_LIB) ||
      !fs.existsSync(BANKROLLER_CORE) ||
      !fs.existsSync(TARGET_DAPP)
    ) {
      console.error(`
        last of path is incorrect
        Lib: ${DC_LIB}
        Bankroller: ${BANKROLLER_CORE}
        Target dapp: ${TARGET_DAPP}
      `)
      process.exit(1)
    }
    
    try {
      /* 
      * Start docker containers with arguments
      * and migrate smart contracts with truffle
      * then copy folder with smart contracts in DCLib
      * or bankroller
      */
      await upENV({ sevice : 'dc_protocol' })
      /**
       * Copy contracts in protocol projects
       */
      await Utils.copyContracts(path.join(DC_LIB, './protocol'))
      await Utils.copyContracts(path.join(BANKROLLER_CORE, './protocol'))
      /**
       * Building lib and copy in TARGET_DAPP folder
       */
      const buildLib = await Utils.startingCliCommand('npm run build:local', DC_LIB)
      
      if (buildLib) {
        const readFileStream  = fs.createReadStream(path.join(DC_LIB, 'dist/DC.js'))
        const writeFileStream = fs.createWriteStream(path.join(TARGET_DAPP, 'DC.js'))
        
        readFileStream.pipe(writeFileStream)
        
        /**
         * Start bankroller-core service
         * with pm2
         */
        await Utils.startPM2Service({
          cwd: BANKROLLER_CORE,
          name: 'bankroller',
          exec_mode: 'fork',
          interpreter: 'sh',
          script: (DC_NETWORK === 'ropsten')
            ? './run_ropsten_env.sh'
            : './run_dev_env.sh'
        })

        resolve({
          code  : 0,
          error : null,
          paths : params.paths
        })
       }
    } catch (err) {
      reject({
        code  : 301,
        error : err,
        paths : params.paths
      })
    }
  })
}

/**
 * Function for exit
 * she stop Env docker containers
 * and delete contracts paths 
 */
async function exit (params) {
  /** Init params */
  const CODE            = params.code             || 0
  const DC_LIB          = params.paths.dclib      || process.cwd()
  const BANKROLLER_CORE = params.paths.bankroller || process.cwd()

  /**
   * Stop PM2 bankroller service
   * and stop docker env
   */
  await Utils.deletePM2Service('bankroller')
  const stopDockerContainer = await stopENV()

  /**
   * If bankroller pm2 service and docker
   * env is stoped then check exist path to
   * contracts and remove in dclib and bankroller
   * projects after process exit with code in params
   */
  if (stopDockerContainer) {
    const libContracts      = path.join(DC_LIB, './protocol')
    const bankrollContracts = path.join(BANKROLLER_CORE, './protocol');

    (fs.existsSync(libContracts))      && Utils.rmFolder(libContracts);
    (fs.existsSync(bankrollContracts)) && Utils.rmFolder(bankrollContracts);
    process.exit(CODE)
  }
}

/**
 * Start unit tests with
 * Folder tests
 */
function Unit() {
  // Load enviroment Variable
  dotenv.config({ path: path.join(__dirname, '../', '.testenv') });
  /*
   * Run jest tests with arguments
   * --runInBand - start test serially in one process
   * --config - start test with config
   * [path/to/file] - path to config.file
   */
  jest.run([
    '--runInBand',
    '--verbose',
    '--config',
    path.join(__dirname, 'jest', 'initConfig.js')
  ])
}

/**
 * Start enviroment for integration
 * tests and run Jest tests
 */
async function Integration (params) {  
  try {
    /**
     * Up test env, handle
     * error reject and start exit function
     * with reject object else start test with resolve object
     */
    const upStatus = await upTestENV(params)
    
    /**
     * Run jest tests with integration config
     */
    const testStart =  await jest.runCLI(
      {
        runInBand: true,
        verbose: true,
        config: path.resolve(__dirname, 'jest', 'initConfig.js')
      },
      
      [path.join(process.cwd(), './src/__tests__/integration')]
    );

    (testStart) && exit(upStatus)
  } catch (err) {
    /**
     * Output log and stat exit function
     * with reject object or resolve object
     */
    console.error(err)
    exit(upStatus)
  }
}

module.exports.exit        = exit
module.exports.upTestENV   = upTestENV
module.exports.Integration = Integration
module.exports.Unit = cmd => Unit(cmd)
