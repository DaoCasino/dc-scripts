const path  = require('path')
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
    containersDown.on('exit', code => {
      (code !== 0 || code === null)
        ? reject(new Error(`Error: docker containers not down. Exit code: ${code}`))
        : resolve(true)
    })
  })
}