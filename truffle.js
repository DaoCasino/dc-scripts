const path             = require('path')
const _config          = require('./src/config/config')
const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    local: {
      host: '127.0.0.1',
      port: 1406,
      gas: 6700000,
      gasPrice: 32,
      network_id: '*'
    },

    ropsten: {
      provider: new HDWalletProvider(process.env.MNEMONIC || _config.secrets.ropsten.mnemonic, 'https://ropsten.infura.io'),
      gas: 5500000,
      gasPrice: 10000000000,
      network_id: 3,
      timeoutBlocks: 200,
      skipDryRun: true 
    }
  },

  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },

  contracts_directory:       path.resolve(__dirname, './_env/contracts'),
  migrations_directory:      path.resolve(__dirname, './_env/migrations'),
  contracts_build_directory: path.resolve(__dirname, './_env/protocol/build')
}
