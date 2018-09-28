const path  = require('path')
const Utils = require('./utils')
const spawn = require('child_process').spawn

module.exports = options => {
  return new Promise(async (resolve, reject) => {
    const SERVICE  = options.service  || 'dc_protocol'
    const RECREATE = options.recreate || '--force-recreate'
    console.log(`${Utils.sudo()} docker-compose up -d ${RECREATE} ${SERVICE}`)
    const containerUp = spawn(`${Utils.sudo()} docker-compose up -d ${RECREATE} ${SERVICE}`, {
      cwd   : path.resolve(__dirname, '../_env'),
      shell : true,
      stdio : 'inherit'
    })

    containerUp
      .on('error', err => reject(err))
      .on('exit', code => {
        (code !== 0 || code === null)
          ? reject(new Error(`Error: Containers not up. Exit code: ${code}`))
          : resolve({code: code, options: options})
      })
  })
}