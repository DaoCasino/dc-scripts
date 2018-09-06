const fs      = require('fs')
const pm2     = require('pm2')
const jest    = require('jest')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const spawn   = require('child_process').spawn
const dotenv  = require('dotenv')
const stopENV = require('./stopENV')
const _config = require('../workflow.config.json')

Utils.exit(stopENV)

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
  process.env.TARGET_TEST = 'integration'

  try {
    /* 
    * Start docker containers with arguments
    * and migrate smart contracts with truffle
    * then copy folder with smart contracts in DCLib
    * or bankroller
    */
    await upENV('dc_protocol')
      .then(() => Utils.copyContracts(path.join(_config.protocolDir, './dclib/protocol')))
      .then(() => Utils.copyContracts(path.join(_config.protocolDir, './bankroller-core/protocol')))
  } catch (err) {
    /** 
     * If handle errors then
     * stop docker containers and exit process
    */
    stopENV()
    console.error(err)
    process.exit()
  }

  pm2.connect(err => {
    if (err) { throw new Error(err) }

    pm2.start({
      name: 'bankroller',
      cwd: path.join(_config.protocolDir, './bankroller-core'),
      script: 'npm',
      args: 'run dev'
    }, (err, apps) => {
      if (err) { throw new Error(err) }
    })
  })

  const libDirectory = path.join(_config.protocolDir, './dclib')
  const buildLib = spawn('npm run build:local', {
    shell: true,
    stdio: 'inherit',
    cwd: libDirectory
  })

  buildLib
    .on('error', err => { throw new Error(err) })
    .on('exit', code => {
      if (code !== 0) {
        throw new Error('Error: Library not build')
      } else {
        const readFileStream  = fs.createReadStream(path.join(libDirectory, 'dist/DC.js'))
        const writeFileStream = fs.createWriteStream(path.join(__dirname, 'tests/dapp/DC.js'))
        
        readFileStream.pipe(writeFileStream)
        
        jest.runCLI(
          { runInBand: true, config: path.resolve(__dirname, 'tests/jest', 'initConfig.js') },
          [ path.join(__dirname, './tests/integration') ]
        ).then(() => {
          pm2.delete('bankroller', err => {
            if (err) {
              throw new Error(err)
            }
            
            stopENV()
            pm2.disconnect()
            
            process.exit()
          })
        })
      }
    })
}

module.exports = cmd => {
  const argv = process.argv.slice(2);

  (cmd.integration) && integration(); 
  (cmd.performance) && performance();
  (cmd.unit || argv.length < 2) && unit();
}
