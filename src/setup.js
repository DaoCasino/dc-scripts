const fs      = require('fs')
const ora     = require('ora')
const path    = require('path')
const chalk   = require('chalk')
const spawn   = require('child_process').spawn
const _config = require('../workflow.config.json')

let spinner = ora('protocol setup...')

function npmInstall (pathRepo) {
  return new Promise((resolve, reject) => {
    spawn('npm install', { stdio: 'inherit', shell: true, cwd: pathRepo })
      .on('error', err => reject(new Error(err)))
      .on('exit', code => {
        if (code !== 0) {
          reject(code)
        } else {
          spinner.start()
          resolve()
        }
      })
  })
}

function cloneRepo (repo, protocolDir) {
  return new Promise((resolve, reject) => {
    let log = []
    const targetPath = path.join(protocolDir, `/${repo}`)
    const startClone = spawn(`git clone ${_config.repo[repo]} ${repo}`, {
      shell: true,
      cwd: protocolDir
    })

    startClone.stderr.on('data', Err  => log.push(`Error: ${Err}`))
    startClone.stdout.on('data', data => log.push(`${data}`))

    startClone
      .on('err', err => reject(new Error(err)))
      .on('exit', code => {
        if (code !== 0) {
          reject(new Error(log.join('\n')))
        }

        spinner.stop()
        resolve(targetPath)
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

  spinner.start()

  for (let repo of Object.keys(_config.repo)) {
    try {
      const pathRepo = await cloneRepo(repo, protocolDir)

      if (typeof pathRepo !== 'undefined') {
        (await npmInstall(pathRepo))
        
        console.clear()
        spinner.info(`${repo} cloned and install`).start()
      }
    } catch (err) {
      spinner.fail('setup fail')
      throw new Error(err)
    }
  }

  _config.protocolDir = protocolDir
  
  const openConfig = fs.openSync(path.join(__dirname, '../workflow.config.json'), 'w')
  fs.writeSync(openConfig, JSON.stringify(_config, null, ' '), 0, 'utf-8')
  
  spinner.succeed('setup complete')
}
