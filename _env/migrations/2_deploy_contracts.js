const Miner      = artifacts.require('./tools/BlockMiner.sol')
const myDAppGame = artifacts.require('./myDAppGame.sol')

module.exports = async function (deployer, network) {
  const addr = require('./config.js')(network).protocol.addresses
  await deployer.deploy(
    myDAppGame    ,
    addr.ERC20    , // ERC20Interface _token       ,
    addr.Referrer , // RefInterface _ref           ,
    addr.GameWL   , // GameWLinterface _gameWL     ,
    addr.PlayerWL , // PlayerWLinterface _playerWL ,
    addr.RSA        // RSA _rsa
  )

  if (
    network === 'development' ||
    network === 'develop' ||
    network === 'coverage'
  ) {
    await deployer.deploy(Miner)
  }

  console.log('>>> Deploy contracts complete <<<')
}

