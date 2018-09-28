const fs    = require('fs')
const path  = require('path')
const Utils = require('./utils')
const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    /** Start container down in docker */
    const containersDown = spawn(`${Utils.sudo()} docker-compose down`, {
      cwd   : path.resolve(__dirname, '../_env'),
      stdio : 'inherit',
      shell : true
    })

    /**
     * Listen for exitCode
     * if exit code !== 0 then catch Error
     */
    containersDown
      .on('error', err => reject(err))
      .on('exit', async code => {
        if (code !== 0 || code === null) {
          reject(new Error(`Error: docker containers not down. Exit code: ${code}`).message)
        }

        const envProtocolPath   = path.join(__dirname, '../_env/protocol')
        const pathToProjectJSON = path.join(__dirname, '../pathToProject.json');

        (fs.existsSync(envProtocolPath)) && await Utils.rmFolder(envProtocolPath)

        if (fs.existsSync(pathToProjectJSON)) {
          const dclibProtocolPath    = path.join(require(pathToProjectJSON), 'dclib/protocol')
          const bankrollProtocolPath = path.join(require(pathToProjectJSON), 'bankroller_core/protocol');

          (fs.existsSync(dclibProtocolPath))    && await Utils.rmFolder(dclibProtocolPath);
          (fs.existsSync(bankrollProtocolPath)) && await Utils.rmFolder(bankrollProtocolPath)
        }

        resolve({ code: code })
      })
  })
}
