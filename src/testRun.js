const fs      = require('fs')
const jest    = require('jest')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const dotenv  = require('dotenv')
const stopENV = require('./stopENV')

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
    '--config',
    path.join(__dirname, 'tests/jest', 'initConfig.js')
  ])
}

function Performance () {
  console.log('performance')
}

/**
 * Start enviroment for integration
 * tests and run Jest tests
 */
async function Integration (params) {
  // Set ENV for tests
  process.env.TARGET_TEST = 'integration'

  const DC_LIB          = params.paths.dclib      || process.cwd()
  const BANKROLLER_CORE = params.paths.bankroller || process.cwd()

  console.log(DC_LIB, BANKROLLER_CORE)



  // PATH for projects directory
  // const pathToProjectJSON = path.join(__dirname, '../pathToProject.json')
  // /**
  //  * Check avalability file with path for projects
  //  */
  // if (!fs.existsSync(pathToProjectJSON)) {
  //   console.error('Error: projects not creating, please use dc-scripts setup [dirname]')
  //   process.exit(1)
  // }

  // // PATH for protocol projects
  // const libDirectory  = path.join(require(pathToProjectJSON), './dclib')
  // const BankrollerDir = path.join(require(pathToProjectJSON), './bankroller_core')
  
  // /**
  //  * Function for exit
  //  * she stop Env docker containers
  //  * and delete contracts paths 
  //  */
  // async function exit (code = 0) {
  //   const stopDockerContainer = await stopENV()

  //   if (stopDockerContainer) {
  //     const libContracts      = path.join(libDirectory, './protocol')
  //     const bankrollContracts = path.join(BankrollerDir, './protocol');

  //     (fs.existsSync(libContracts))      && Utils.rmFolder(libContracts);
  //     (fs.existsSync(bankrollContracts)) && Utils.rmFolder(bankrollContracts);
  //     process.exit(code)
  //   }
  // }

  // try {
  //   /* 
  //   * Start docker containers with arguments
  //   * and migrate smart contracts with truffle
  //   * then copy folder with smart contracts in DCLib
  //   * or bankroller
  //   */
  //   await upENV({ sevice : 'dc_protocol' })
  //   /**
  //    * Copy contracts in protocol projects
  //    */
  //   await Utils.copyContracts(path.join(libDirectory, './protocol'))
  //   await Utils.copyContracts(path.join(BankrollerDir, './protocol'))
  //   /**
  //    * Start Build DCLib
  //    * and get build version in test dapp
  //    */
  //   const buildLib = await Utils.startingCliCommand('npm run build:local', libDirectory)
    
  //   if (buildLib) {
  //     const readFileStream  = fs.createReadStream(path.join(libDirectory, 'dist/DC.js'))
  //     const writeFileStream = fs.createWriteStream(path.join(__dirname, 'tests/dapp/DC.js'))
      
  //     readFileStream.pipe(writeFileStream)
      
  //     /**
  //      * Start bankroller-core service
  //      * with pm2
  //      */
  //     await Utils.startPM2Service({
  //       cwd         : BankrollerDir,
  //       name        : 'bankroller',
  //       exec_mode   : 'fork',
  //       script      : './run_dev_env.sh',
  //       interpreter : 'sh'
  //     })
  //    }
  // } catch (err) {
  //   /**
  //    * if error then stop bankroller in pm2
  //    * stop docker container protocol and
  //    * exit process
  //    */
  //   console.error(err)
    
  //   await Utils.deletePM2Service('bankroller')
  //   exit(301)
  // }
  
  // try {
  //   /**
  //    * Run jest tests with integration config
  //    */
  //   const testStart =  await jest.runCLI(
  //     { runInBand: true, config: path.resolve(__dirname, 'tests/jest', 'initConfig.js') },
  //     [path.join(__dirname, './tests/integration')])

  //   if (testStart) {
  //     await Utils.deletePM2Service('bankroller')
  //     exit()
  //   }
  // } catch (err) {
  //   console.error(err)
  //   await Utils.deletePM2Service('bankroller')
  //   exit(301)
  // }
}

module.exports.Performance = Performance
module.exports.Integration = Integration
module.exports.Unit = cmd => Unit(cmd)
