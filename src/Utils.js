const pm2   = require('pm2')
const ncp   = require('ncp').ncp
const path  = require('path')
const spawn = require('child_process').spawn

function randomInteger (min, max) {
  return Math.round(
    min - 0.5 + Math.random() * (max - min + 1)
  )
}

function copyContracts (target_path) {
  return new Promise((resolve, reject) => {
    ncp(
      path.join(__dirname, '../_env/protocol'),
      target_path,
      err => {
        (err) && reject(err)
        console.log('done')
        resolve(true)
      }
    )
  })
}

function startPM2Service (config) {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      (err) && reject(err)

      pm2.start(config, (err, apps) => {
        (err) ? reject(err) : resolve(true)
      })
    })
  })
}

function deletePM2Service (name) {
  return new Promise((resolve, reject) => {
    pm2.delete('bankroller', async err => {
      (err) && reject(new Error(err))
      
      pm2.disconnect()
      resolve()
    })
  })
}

function startingCliCommand (cmd, target) {
  return new Promise((resolve, reject) => {
    const command = spawn(cmd, {
      cwd   : target,
      stdio : 'inherit',
      shell : true
    })

    command.on('error', err => reject(err))
    command.on('exit', code => {
      (code !== 0 || code === null)
        ? reject(new Error(`Error: command: ${cmd} not finished. Exit code ${code}`))
        : resolve(true)
    })
  })
}

function exitListener (f) {
  [ 'SIGINT', 'SIGTERM', 'SIGBREAK' ]
    .forEach(SIGNAL => {    
      process.on(SIGNAL, () => {      
        console.log('')
        console.warn(chalk.yellow('WARNING: process out'))

        f()
      })
    })
}

module.exports.exitListener       = exitListener
module.exports.copyContracts      = copyContracts
module.exports.randomInteger      = randomInteger
module.exports.startPM2Service    = startPM2Service
module.exports.deletePM2Service   = deletePM2Service
module.exports.startingCliCommand = startingCliCommand
