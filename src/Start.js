const path  = require('path')
const Utils = require('./Utils')
const upENV = require('./upEnv')

module.exports = cmd => {
  upENV({service: (cmd.protocol) ? 'dc_protocol' : ''})
    .then(() => Utils.copyContracts(path.join(process.cwd(), 'protocol')))
    .catch(err => {
      console.error('Error with code: ', err)
      process.exit()
    })
}