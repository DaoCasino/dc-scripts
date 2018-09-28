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
      _        : 'Developer ETH address for deploy your game contaract',
      rpc_url  : 'https://ropsten.infura.io/JCnK5ifEPH9qcQkX0Ahl',
      address  : '0xd0C478e53A6C349f819fb18628C3EF20aC9a7CF2',
      privkey  : 'babaa8987e128f18372c133122e57848923059f8d18980eadf273ea0a8b811f7',
      mnemonic : 'glass method front super auto hole know grace select prevent custom fancy'
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
    },
    stress_test: {
      link: 'git@github.com:DaoCasino/stress_test.git',
      branch: ''
    }
  }
}
