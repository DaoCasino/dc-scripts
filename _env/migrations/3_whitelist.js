/* global artifacts web3 */
const path       = require('path')
const myDAppGame = artifacts.require('./myDAppGame.sol')

module.exports = async function (deployer, network, accounts) {
  if (network === 'ropsten' || network === 'ropsten-fork') return

  const config = require('./config.js')(network)
  const addr   = config.protocol.addresses;

  const GameWL   = new web3.eth.Contract(require(path.resolve(config.protocol.contracts + '/GameWL.json')).abi   , addr.GameWL   )
  const PlayerWL = new web3.eth.Contract(require(path.resolve(config.protocol.contracts + '/PlayerWL.json')).abi , addr.PlayerWL )

  const options = {
    gas      : 6700000,
    from     : accounts[0],
    gasPrice : 120000000000
  }

  await GameWL.methods.addGame(myDAppGame.address)
    .send(options)
    .on('transactionHash', txHash => console.log(`TX Hash: ${txHash}`))
    .on('error', error => {
      console.error('error', error)
      process.exit(1)
    })

  const amount = web3.utils.toWei('1000')
  PlayerWL.methods.setAmountForPlayer(accounts[0], amount).send(options)
  PlayerWL.methods.setAmountForPlayer(accounts[1], amount).send(options)
  PlayerWL.methods.setAmountForPlayer(accounts[2], amount).send(options)
}
