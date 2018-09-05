/* global artifacts web3 */
const path = require('path')

module.exports = async function (deployer, network) {
  const config = require('./config.js')(network)
  const addr   = config.protocol.addresses

  const WEB3 = (!process.env.DC_NETWORK && process.env.DC_NETWORK !== 'ropsten')
    ? new (require('web3'))(web3.currentProvider)
    : new (require('web3'))(new web3.providers.HttpProvider(config.infura.ropsten.provider))

  const myDAppGame = artifacts.require('./myDAppGame.sol')

  const GameWL   = new WEB3.eth.Contract(require(path.resolve(config.protocol.contracts + '/GameWL.json')).abi   , addr.GameWL   )
  const PlayerWL = new WEB3.eth.Contract(require(path.resolve(config.protocol.contracts + '/PlayerWL.json')).abi , addr.PlayerWL )

  (await GameWL.methods.addGame(myDAppGame.address)
    .send({
      from: web3.eth.accounts[0],
      gas: 6700000,
      gasPrice: 120000000000
    })
    .on('transactionHash', transactionHash => {
      console.log('transactionHash', transactionHash)
    })
    .on('receipt', receipt => {
      console.log('receipt',receipt)
    })
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
    }));

  const amount = WEB3.utils.toWei('1000')
  PlayerWL.methods.setAmountForPlayer(web3.eth.accounts[0], amount).send(opts)
  PlayerWL.methods.setAmountForPlayer(web3.eth.accounts[1], amount).send(opts)
  PlayerWL.methods.setAmountForPlayer(web3.eth.accounts[2], amount).send(opts)
}
