module.exports = {
  recomendNodeVersion: '10.8.0',
  
  repo: {

    dclib: {
      link: 'git@github.com:DaoCasino/DCLib.git',
      branch: 'dc-scripts'
    },
    
    bankroller_core: {
      link: 'git@github.com:DaoCasino/bankroller-core.git',
      branch: 'dc-scripts'
    }
  
  },

  puppeterBrowserConfig: {
    dumpio: true,
    handleSIGINT: false,
    timeout: 0,
    rgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--enable-features=NetworkService'
    ]
  }
}
