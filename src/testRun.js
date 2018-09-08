const fs      = require('fs')
const jest    = require('jest')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const dotenv  = require('dotenv')
const stopENV = require('./stopENV')
const _config = require('./config/config.json')

/**
 * Start unit tests with
 * Folder tests
 */
function unit() {
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

/**
 * Start enviroment for integration
 * tests and run Jest tests
 */
async function integration () {
  // Set ENV for tests
  process.env.TARGET_TEST = 'integration'
  // PATH for protocol projects
  const libDirectory  = path.join(_config.projectsDir, './dclib')
  const BankrollerDir = path.join(_config.projectsDir, './bankroller-core')
  
  try {
    /* 
    * Start docker containers with arguments
    * and migrate smart contracts with truffle
    * then copy folder with smart contracts in DCLib
    * or bankroller
    */
    await upENV({ sevice : 'dc_protocol', recreate : true })
    /**
     * Copy contracts in protocol projects
     */
    await Utils.copyContracts(path.join(libDirectory, './protocol'))
    await Utils.copyContracts(path.join(BankrollerDir, './protocol'))
    /**
     * Start Build DCLib
     * and get build version in test dapp
     */
    const buildLib = await Utils.startingCliCommand('npm run build:local', libDirectory)
    
    if (buildLib) {
      const readFileStream  = fs.createReadStream(path.join(libDirectory, 'dist/DC.js'))
      const writeFileStream = fs.createWriteStream(path.join(__dirname, 'tests/dapp/DC.js'))
      
      readFileStream.pipe(writeFileStream)
      
      /**
       * Start bankroller-core service
       * with pm2
       */
      await Utils.startPM2Service({
        cwd         : BankrollerDir,
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
    await stopENV()
    process.exit(301)
  }
  
  /**
   * Run jest tests with integration config
   */
  jest.runCLI(
    { runInBand: true, config: path.resolve(__dirname, 'tests/jest', 'initConfig.js') },
    [ path.join(__dirname, './tests/integration') ]
  ).then(async () => {
    await Utils.deletePM2Service('bankroller')
    await stopENV()
    process.exit()
  }).catch(async err => {
    console.error(err)

    await Utils.deletePM2Service('bankroller')
    await stopENV()
    process.exit()
  })
}

module.exports = cmd => {
  /** Parse cli arguments */
  const argv = process.argv.slice(2);

  /**
   * Start tests with arg
   */
  (cmd.integration) && integration(); 
  (cmd.performance) && performance();
  (cmd.unit || argv.length < 2) && unit();
}
