const fs           = require('fs')
const addresses    = require('./protocol/addresses.json')
const dappContract = require('./protocol/dapp.contract.json')

if (
  !fs.existsSync('./protocol/dapp.contract.json') &&
  !fs.existsSync('./protocol/addresses.json')
) {
  console.log()
  console.log('Cant find contracts please start')
  console.log()
  process.exit()
}

module.exports = {
  ERC20: {
    address: addresses.ERC20,
    abi: require('./protocol/contracts/ERC20.json').abi
  },
  paychannel: {
    address: dappContract.address,
    abi: dappContract.abi
  }
}