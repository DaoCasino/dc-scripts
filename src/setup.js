const fs      = require('fs')
const path    = require('path')
const chalk   = require('chalk')
const spawn   = require('child_process').spawn
const _config = require('./config/config.json')

/**
 * cloned Repository with arguments 
 */
function cloneRepo (params = false) {
  if (!params) return

  return new Promise((resolve, reject) => {
    const repoUrl     = params.repo.link 
    const dirName     = params.dirName     || ''
    const branchName  = params.repo.branch || 'master'
    const projectsDir = params.projectsDir || process.cwd()
    /**
     * create child_process [git clone]
     */
    const gitClone = spawn(`git clone -b ${branchName} ${repoUrl} ${dirName}`, {
      shell: true,
      stdio: 'inherit',
      cwd: projectsDir
    })
  
    gitClone
      .on('err', err => reject(new Error(err)))
      .on('exit', code => {
        (code !== 0 || code === null)
          ? reject(new Error(`Error: clone repo abort with code ${code}`))
          : resolve(path.join(projectsDir, dirName))
      })
  })
}

function installProject (pathToRepo, useYarn = false) {
  if (!pathToRepo) return

  return new Promise((resolve, reject) => {
    /**
     * If useYarn = true then use yarn package manager
     */
    const command = (useYarn) ? 'yarn install' : 'npm install'
  
    /**
     * Create child_process install with package manager
     */
    spawn(command, { stdio: 'inherit', shell: true, cwd: pathToRepo })
      .on('error', err => reject(err))
      .on('exit', code => {
        (code !== 0 || code === null)
          ? reject(new Error(`Error: crash install dependencies. Exit code: ${code}`))
          : resolve(true)
      })
  })
}

module.exports = async (cmd, pathToDir) => {
  /**
   * check empty protocol directory
   * for path in config file and exit process 
   * if directory not empty
   */
  if (_config.projectsDir !== '') {
    console.error(chalk.red(`
      Protocol is installed with folder ${chalk.green(_config.projectsDir)}
      if have reinstall then use:
      ${chalk.yellow('dc-scripts remove && dc-scripts setup [nameDir]')}
    `))

    process.exit()
  }

  /**
   * If in arguments there is path
   * then create directory with arguments path
   * else create in target directory
   */
  const pathToCreate = (typeof pathToDir !== 'undefined')
    ? path.join(process.cwd(), pathToDir)
    : path.join(process.cwd(), './');
  
  (!fs.existsSync(pathToCreate)) && fs.mkdirSync(pathToCreate) 
  console.clear()

  /**
   * Check target nodejs version
   * and warning if target node version less recomended
   */
  if (process.versions.node < _config.recomendNodeVersion) {
    console.warn(chalk.yellow(`
      Your node js less current versions

      Recomend version: ${_config.recomendNodeVersion}
      Target version: ${process.versions.node}

      for correct work protocol recommended install ${_config.recomendNodeVersion} version
    `))
  }

  /**
   * Creating and install repositories
   */
  for (let project of Object.keys(_config.repo)) {
    try {
      /**
       * Clone repository
       * returns path to cloned repo
       */
      const projectPath = await cloneRepo({
        repo        : _config.repo[project],
        dirName     : project,
        projectsDir : pathToCreate
      })

      /**
       * if path to cloned repo not empty
       * else instal dependencies with package manager
       */
      if (projectPath) {
        await installProject(projectPath, (cmd.yarn) && true)
        console.clear()
      }
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }

  /**
   * Update config file
   * add path to projects directory
   */
  _config.projectsDir = pathToCreate
  const openConfig = fs.openSync(path.join(__dirname, './config/config.json'), 'w')
  fs.writeSync(openConfig, JSON.stringify(_config, null, ' '), 0, 'utf-8')
}
