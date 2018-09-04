const path  = require('path')
const Utils = require('./Utils')
const spawn = require('child_process').spawn

module.exports = cmd => {
  const protocol = (cmd.protocol)
    ? 'dc_protocol'
    : ''

  const containerUp = spawn(`sh ./_scripts/start.sh ${protocol}`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../_env'),
    shell: true
  })

  containerUp.on('exit', code => {
    if (code === 0) {
      spawn('npm run migrate', {
        shell: true,
        stdio: 'inherit',
        cwd: path.join(__dirname, '../')
      })
      .on('error', err => {
        console.error(err)
        process.exit()
      })
      .on('exit', code => {
        if (code === 0) {
          Utils.copyContracts(path.join(process.cwd(), 'protocol'))
        } else {
          console.error('Error with code: ', code)
          process.exit(code)
        }
      })
    }
  })
}