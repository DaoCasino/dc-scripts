const path  = require('path')
const spawn = require('child_process').spawn

module.exports = cmd => {
  const protocol = (cmd.protocol)
    ? 'dc_protocol'
    : ''

  spawn(`docker-compose up -d ${protocol}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../_env'),
    shell: true
  })
}