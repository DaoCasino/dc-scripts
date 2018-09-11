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
  const DC_LIB          = params.paths.dclib      || process.cwd()
  const BANKROLLER_CORE = params.paths.bankroller || process.cwd()

  if (!fs.existsSync(DC_LIB) || !fs.existsSync(BANKROLLER_CORE)) {
    console.error('DCLib or Bankroller is not define')
    process.exit(1)
  }
  
  /**
   * Function for exit
   * she stop Env docker containers
   * and delete contracts paths 
   */
  async function exit (code = 0) {
    const stopDockerContainer = await stopENV()

    if (stopDockerContainer) {
      const libContracts      = path.join(DC_LIB, './protocol')
      const bankrollContracts = path.join(BANKROLLER_CORE, './protocol');

      (fs.existsSync(libContracts))      && Utils.rmFolder(libContracts);
      (fs.existsSync(bankrollContracts)) && Utils.rmFolder(bankrollContracts);
      process.exit(code)
    }
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
     * Start Build DCLib
     * and get build version in test dapp
     */
    const buildLib = await Utils.startingCliCommand('npm run build:local', DC_LIB)
    
    if (buildLib) {
      const readFileStream  = fs.createReadStream(path.join(DC_LIB, 'dist/DC.js'))
      const writeFileStream = fs.createWriteStream(path.join(process.cwd(), 'src/dapp/DC.js'))
      
      readFileStream.pipe(writeFileStream)
      
      /**
       * Start bankroller-core service
       * with pm2
       */
      await Utils.startPM2Service({
        cwd         : BANKROLLER_CORE,
        name        : 'bankroller',
        exec_mode   : 'fork',
        script      : './run_dev_env.sh',
        interpreter : 'sh'
      })
     }
  } catch (err) {
    /**
     * if error then stop bankroller in pm2
     * stop docker container protocol and
     * exit process
     */
    console.error(err)
    
    await Utils.deletePM2Service('bankroller')
    exit(301)
  }
  
  try {
    /**
     * Run jest tests with integration config
     */
    const testStart =  await jest.runCLI(
      { runInBand: true, config: path.resolve(__dirname, 'jest', 'initConfig.js') },
      [path.join(process.cwd(), './src/__tests__/integration')])

    if (testStart) {
      await Utils.deletePM2Service('bankroller')
      exit()
    }
  } catch (err) {
    console.error(err)
    await Utils.deletePM2Service('bankroller')
    exit(301)
  }
}

module.exports.Performance = Performance
module.exports.Integration = Integration
module.exports.Unit = cmd => Unit(cmd)
