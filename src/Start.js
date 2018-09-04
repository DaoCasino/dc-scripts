const ncp   = require('ncp').ncp
const path  = require('path')
const spawn = require('child_process').spawn

module.exports = cmd => {
  const protocol = (cmd.protocol)
    ? 'dc_protocol'
    : ''

  const containerUp = spawn(`docker-compose up -d ${protocol}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../_env'),
    shell: true
  })

  containerUp.on('exit', code => {
    if (code === 0) {
      ncp(
        path.join(__dirname, '../_env/protocol'),
        path.join(process.cwd(), 'protocol'),
        err => {
          if (err) {
            console.error(err)
            process.exit()
          }
        }
      )
    }
  })
}