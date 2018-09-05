const fs      = require('fs')
const pm2     = require('pm2')
const jest    = require('jest')
const path    = require('path')
const Utils   = require('./Utils')
const upENV   = require('./upEnv')
const spawn   = require('child_process').spawn
const _config = require('../workflow.config.json')

function unit() {
  require('dotenv').config({ path: path.resolve(__dirname, '../.testenv') });

  const args = []
  
  args.push('--config', path.resolve(__dirname, 'tests/jest', 'initConfig.js'))
  jest.run(args)
}

async function integration () {
  process.env.TARGET_TEST = 'integration'

  /* up Env for testing */
  try {
    await upENV('dc_protocol', '--force-recreate')
    Utils.copyContracts(path.join(_config.protocolDir, './dclib/protocol'))
    Utils.copyContracts(path.join(_config.protocolDir, './bankroller-core/protocol'))
  } catch (err) {
    console.error(err)
    process.exit()
  }

  pm2.connect(err => {
    if (err) { throw new Error(err) }

    pm2.start({
      name: 'bankroller',
      cwd: path.join(_config.protocolDir, './bankroller-core'),
      script: 'npm',
      args: 'run start'
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
            if (err) { throw new Error(err) }
            
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
