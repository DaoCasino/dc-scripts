const fs    = require('fs')
const path  = require('path')
const Utils = require('./Utils')
const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    /**
     * Start container down in docker
     */
    const containersDown = spawn('docker-compose down', {
      cwd   : path.resolve(__dirname, '../_env'),
      stdio : 'inherit',
      shell : true,
    })
  
    /**
     * Listen for exitCode
     * if exit code !== 0 then catch Error
     */
    containersDown.on('exit', async code => {
      const pathToProjectJSON = path.join(__dirname, '../pathToProject.json')

      if (code !== 0 || code === null) {
        reject(new Error(`Error: docker containers not down. Exit code: ${code}`))
      } else if (
        fs.existsSync(pathToProjectJSON) &&
        fs.existsSync(require(pathToProjectJSON))
      ) {
        await Utils.rmFolder(path.join(require(pathToProjectJSON), 'bankroller_core/protocol'))
        await Utils.rmFolder(path.join(require(pathToProjectJSON), 'dclib/protocol'))
        resolve(true)
      }
    })
  })
}