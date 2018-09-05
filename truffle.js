const path = require('path')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 1406,
      gas: 7984452, // Block Gas Limit same as latest on Mainnet https://ethstats.net/
      gasPrice: 2000000000, // same as latest on Mainnet https://ethstats.net/
      network_id: '*'
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
