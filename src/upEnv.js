const path  = require('path')
const spawn = require('child_process').spawn

module.exports = (protocol, recreate = '') => {
  return new Promise((resolve, reject) => {
    const containerUp = spawn(`sh ./_scripts/start.sh ${protocol} ${recreate}`, {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../_env'),
      shell: true
    })

    containerUp
      .on('error', err => reject(new Error(err)))
      .on('exit', code => {
        (code !== 0)
          ? reject(new Error(code))
          : resolve()
      })
  })
}