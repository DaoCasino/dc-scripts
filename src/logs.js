const path  = require('path')
const Utils = require('./utils')

module.exports = service => {
  Utils.checkDockerContainer(service)
    .then(status => {
      if (!status) {
        console.info(`Docker container with name: ${service} not started`)
        return
      }

      Utils.startingCliCommand(
        `${Utils.sudo()} npm run logs:${service}`,
        path.join(__dirname, '../_env')
      )
    }) 
}