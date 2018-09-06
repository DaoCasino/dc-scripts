const fs    = require('fs')
const path  = require('path')
const spawn = require('child_process').spawn

module.exports = () => {
  process.env.TARGET_PATH = path.resolve(process.cwd(), 'protocol')

  const containerDown = spawn('docker-compose down', {
    shell: true,
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../_env')
  })

  containerDown.on('exit', () => {
    if (code !== 0) {
      throw new Error('Error: docker containers not down')
    } else if (fs.existsSync(process.env.TARGET_PATH)) {
      spawn(`rm -rf ${process.env.TARGET_PATH}`, {
        shell: true,
        stdio: 'inherit',
        cwd: process.cwd()
      })
    }
  })
}