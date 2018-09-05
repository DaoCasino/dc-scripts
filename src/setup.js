const fs      = require('fs')
const ora     = require('ora')
const path    = require('path')
const chalk   = require('chalk')
const spawn   = require('child_process').spawn
const _config = require('../workflow.config.json')

function npmInstall (pathRepo) {
  return new Promise((resolve, reject) => {
    spawn('npm install', { stdio: 'inherit', shell: true, cwd: pathRepo })
      .on('error', err => reject(new Error(err)))
      .on('exit', code => {
        (code !== 0)
          ? reject(code)
          : resolve()
      })
  })
}

function cloneRepo (repo, folderName, protocolDir) {
  return new Promise((resolve, reject) => {
    const targetPath = path.join(protocolDir, `/${folderName}`)
    const startClone = spawn(`git clone -b ${repo.branch} ${repo.link} ${folderName}`, {
      shell: true,
      stdio: 'inherit',
      cwd: protocolDir
    })

    startClone
      .on('err', err => reject(new Error(err)))
      .on('exit', code => {
        (code !== 0)
          ? reject(new Error(`Error: clone repo abort with code ${code}`))
          : resolve(targetPath)
      })
  })
}

module.exports = async pathToDirectory => {
  const protocolDir = (typeof pathToDirectory !== 'object')
    ? path.join(process.cwd(), pathToDirectory)
    : path.join(process.cwd(), './');

  if (
    typeof _config.protocolDir !== 'string' &&
    _config.protocolDir === '' &&
    _config.protocolDir === ' '
  ) {
    throw new Error(chalk.red(`
      Protocol is installed with folder ${chalk.green(_config.protocolDir)}
      if have reinstall then use:
      ${chalk.yellow('dc-scripts remove && dc-scripts setup [foldername]')}
    `))
  }

  (!fs.existsSync(protocolDir)) && fs.mkdirSync(protocolDir) 

  console.clear()
  
  if (process.versions.node < _config.recomendNodeVersion) {
    console.warn(chalk.yellow(`
      Your node js less current versions

      Recomend version: ${_config.recomendNodeVersion}
      Target version: ${process.versions.node}

      for correct work protocol recommended install ${_config.recomendNodeVersion} version
    `))
  }

  for (let repo of Object.keys(_config.repo)) {
    try {
      const pathRepo = await cloneRepo(_config.repo[repo], repo, protocolDir)

      if (typeof pathRepo !== 'undefined') {
        (await npmInstall(pathRepo))
        console.clear()
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  _config.protocolDir = protocolDir
  
  const openConfig = fs.openSync(path.join(__dirname, '../workflow.config.json'), 'w')
  fs.writeSync(openConfig, JSON.stringify(_config, null, ' '), 0, 'utf-8')  
}
