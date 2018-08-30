const path  = require('path')
const spawn = require('child_process').spawn

module.exports = cmd => {
  process.env.TARGET_PATH = path.resolve(process.cwd(), 'protocol')
  
  const protocol = (cmd.protocol)
    ? 'dc_protocol'
    : ''

  const containerUp = spawn(`docker-compose up -d ${protocol}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../_env'),
    shell: true
  })

  containerUp.on('close', () => {
    spawn('npm run migrate', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../'),
      shell: true
    })
  })
}