module.exports = {
  recomendNodeVersion: '10.8.0',
  
  secrets: {
    local: {
      _: 'See _env/README.md',
      mnemonic: 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat',
      accounts: {
        '0x627306090abab3a6e1400e9345bc60c78a8bef57': '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'
      }
    },
    ropsten: {
      _: 'Developer ETH address for deploy your game contaract',
      address: '0xd0C478e53A6C349f819fb18628C3EF20aC9a7CF2',
      privkey: '0x281cc410b625d3603f57b234dd35d5c1baf14adce9a1029527295ff417cef804'

    }
  },

  repo: {
    dclib: {
      link: 'git@github.com:DaoCasino/DCLib.git',
      branch: 'dc-scripts'
    },
    bankroller_core: {
      link: 'git@github.com:DaoCasino/bankroller-core.git',
      branch: 'dc-scripts'
    },
    integration_test: {
      link: 'git@github.com:DaoCasino/integration_tests.git',
      branch: ''
    }
  }
}
