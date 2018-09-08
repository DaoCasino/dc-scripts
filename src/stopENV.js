const fs    = require('fs')
const path  = require('path')
const spawn = require('child_process').spawn

module.exports = () => {
  return new Promise((resolve, reject) => {
    const targetPath = path.resolve(process.cwd(), 'protocol')
    const containersDown = spawn('docker-compose down', {
      cwd   : path.resolve(__dirname, '../_env'),
      stdio : 'inherit',
      shell : true,
    })
  
    containersDown.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Error: docker containers not down. Exit code: ${code}`))
      } else if (fs.existsSync(targetPath)) {
        const rmDir = spawn(`rm -rf ${targetPath}`, {
          shell: true,
          stdio: 'inherit',
          cwd: process.cwd()
        })

        rmDir.on('exit', code => {
          (code !== 0 || code === null)
            ? reject(new Error(`Error: Remove protocol directory not finished. Exit code: ${code}`))
            : resolve(true)
        })
      }
    })
  })
}