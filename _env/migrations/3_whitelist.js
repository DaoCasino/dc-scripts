/* global artifacts web3 */
const path = require('path')

module.exports = function (deployer, network, accounts) {
  const config = require('./config.js')(network)
  const addr   = config.protocol.addresses

  const WEB3 = (network !== 'ropsten')
    ? new (require('web3'))(web3.currentProvider)
    : new (require('web3'))(new web3.providers.HttpProvider(config.infura.ropsten.provider))

  const myDAppGame = artifacts.require('./myDAppGame.sol')

  const GameWL   = new WEB3.eth.Contract(require(path.resolve(config.protocol.contracts + '/GameWL.json')).abi   , addr.GameWL   )
  const PlayerWL = new WEB3.eth.Contract(require(path.resolve(config.protocol.contracts + '/PlayerWL.json')).abi , addr.PlayerWL )

  const options = {
    from: accounts[0],
    gas: 6700000,
    gasPrice: 120000000000
  }

  GameWL.methods.addGame(myDAppGame.address).send(options)
    .on('transactionHash', transactionHash => console.log('transactionHash', transactionHash))
    .on('receipt', receipt => console.log('receipt',receipt))
    .on('confirmation', (confirmationNumber, receipt) => {
      (confirmationNumber < 3) && console.log('confirmationNumber', confirmationNumber)
    })
    .on('error', error => {
      console.error('error', error)
      process.exit(1)
    })
    .then(res => console.log(res))
    .catch(err => {
      throw new Error(err)
    });

  const amount = WEB3.utils.toWei('1000')
  PlayerWL.methods.setAmountForPlayer(accounts[0], amount).send(options)
  PlayerWL.methods.setAmountForPlayer(accounts[1], amount).send(options)
  PlayerWL.methods.setAmountForPlayer(accounts[2], amount).send(options)
}
