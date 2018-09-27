const fs    = require('fs')
const os    = require('os')
const pm2   = require('pm2')
const ncp   = require('ncp').ncp
const path  = require('path')
const chalk = require('chalk')
const spawn = require('child_process').spawn
const UUID  = require('node-machine-id')



const sudo = () => {
  /**
   * Check os if os === Linux or
   * env variable SUDO_UID !== undefined
   * then return with sudo else return
   * without sudo
   */
  const sudoAdd = (
    os.type() === 'Linux' ||
    typeof process.env.SUDO_UID !== 'undefined'
  ) ? 'sudo -E' : ' '
   
  return sudoAdd
}

/** Random number with number every min --- max */
function randomInteger (min, max) {
  return Math.round(
    min - 0.5 + Math.random() * (max - min + 1)
  )
}

/** Copy contracts directory to target_path */
function copyContracts (target_path) {
  return new Promise((resolve, reject) => {
    ncp(
      path.join(__dirname, '../_env/protocol'),
      target_path,
      err => (err) ? reject(err) : resolve(target_path)
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
      
      await pm2.disconnect()
      resolve(name)
    })
  })
}

function checkDockerContainer(serviceName = 'dc_protocol') {
  return new Promise((resolve, reject) => {
    const log = []
    const checkContainer = spawn(`${sudo()} docker ps -q -f name=${serviceName}`, {
      shell: true,
      cwd: path.join(__dirname, '../_env')
    })

    checkContainer.stderr.on('data', errorData => log.push(`${errorData.join('')}`))
    checkContainer.stdout.on('data', data => log.push(`${data.join('')}`))

    checkContainer
      .on('error', err => reject(err))
      .on('exit', code => {
        (code !== 0 || code === null)
          ? reject(new Error(`Error: check exit with code: ${code}`))
          : resolve((log.length === 0) ? false : true)
      })
  })
}

function startingCliCommand (cmd, target) {
  return new Promise((resolve, reject) => {
    /**
     * Start child process with arguments comman
     * in target cwd
     */
    const command = spawn(cmd, {
      cwd   : target,
      stdio : 'inherit',
      shell : true
    })

    /** Handle error and exit code */
    command.on('error', err => reject(err))
    command.on('exit', code => {
      /**
       * If exit code = null or 0 then reject error
       * function else resolve object with code and params
       */
      (code !== 0 || code === null)
        ? reject(new Error(`Error: command: ${cmd} not finished. Exit code ${code}`))
        : resolve({code: code, command: cmd, targetCwd: target})
    })
  })
}

function exitListener (f) {
  /**
   * listening for array signalls
   * and call funct wich argument
   */
  [ 'SIGINT', 'SIGTERM', 'SIGBREAK' ]
    .forEach(SIGNAL => {    
      process.on(SIGNAL, () => {      
        console.log('')
        console.warn(chalk.yellow('WARNING: process out'))

        f()
        process.kill(0, 'SIGKILL')
        process.exit()
      })
    })
}

function rmFolder (targetPath) {
  /** Check exist with argument path */
  if (!fs.existsSync(targetPath)) {
    throw new Error(`File or folder not exist with path: ${targetPath}`)
  }

  try {
    /** Read directory with target path */
    const readDirectory = fs.readdirSync(targetPath)
    /**
     * check files in directory
     * and call functions for each of them
     */
    if (readDirectory.length > 0) {
      readDirectory.forEach(file => {
        /**
         * path to target file
         */
        const innerPath = path.join(targetPath, file)
        
        /** check availability file and check correct innerPath */
        if (typeof innerPath !== 'undefined' && fs.existsSync(innerPath)) {
          /** 
           * check isDirectory with innerPath 
           * if true then recursive call rmFilder func else
           * delete this file
           */
          (fs.lstatSync(innerPath).isDirectory())
            ? rmFolder(innerPath)
            : fs.unlinkSync(innerPath)
        } 
      })
    }

    fs.rmdirSync(targetPath)
  } catch (err) {
    console.error(chalk.red(err))    
    process.exit()
  }
}

module.exports.UUID                 = ()=>{ return UUID.machineIdSync({original: true}) }
module.exports.sudo                 = sudo
module.exports.rmFolder             = rmFolder
module.exports.exitListener         = exitListener
module.exports.copyContracts        = copyContracts
module.exports.randomInteger        = randomInteger
module.exports.startPM2Service      = startPM2Service
module.exports.deletePM2Service     = deletePM2Service
module.exports.startingCliCommand   = startingCliCommand
module.exports.checkDockerContainer = checkDockerContainer
