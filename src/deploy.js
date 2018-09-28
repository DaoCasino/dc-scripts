const fs    = require('fs')
const path  = require('path')
const Utils = require('./utils')

module.exports = async (network) => {
  try {
    const containerStatus = await Utils.checkDockerContainer('dc_protocol')
  
    if (network !== 'local' || containerStatus) {
      const migrate = await Utils.startingCliCommand(
        `${Utils.sudo()} npm run migrate:${network}`,
        path.join(__dirname, '../')
      );
    
      (migrate && fs.existsSync(path.join(__dirname, '..', '_env/protocol/dapp.contract.json'))) &&
        await Utils.copyContracts(path.join(process.cwd(), 'protocol'))
    } else {
      console.error('Docker container dc_protocol not started')
      process.exit()
    }
  } catch (err) {
    console.error(err)
    process.exit()
  }
}