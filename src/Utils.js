const ncp  = require('ncp').ncp
const path = require('path')

module.exports.randomInteger = function (min, max) {
  return Math.round(
    min - 0.5 + Math.random() * (max - min + 1)
  )
}

module.exports.copyContracts = function (target_path) {
  ncp(
    path.join(__dirname, '../_env/protocol'),
    target_path,
    err => {
      if (err) {
        console.error(err)
        process.exit()
      }
    }
  )
}