const fs      = require('fs')
const path    = require('path')
const chalk   = require('chalk')
const Utils   = require('./Utils')
const spawn   = require('child_process').spawn
const _config = require('./config/config')

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
     * TOODOO: yarn install is not working
     * npm install only
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
   * Path for file in which path to project directory
   */
  const pathToFileJSON = path.join(__dirname, '../pathToProject.json')
  /**
   * check empty protocol directory
   * for path in project path file and exit process 
   * if directory not empty
   */
  if (fs.existsSync(pathToFileJSON)) {
    console.error(chalk.red(`
      Protocol is installed with folder ${chalk.green(require(pathToFileJSON))}
      if have reinstall then use:
      ${chalk.yellow('dc-scripts uninstall && dc-scripts setup [nameDir]')}
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
   * Clear cache with yarn install
   * TOODOO: yarn install not working
   * this code is ivalid
   */
  // (cmd.yarn) && await Utils.startingCliCommand('yarn cache clean')

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
  const pathToProject  = JSON.stringify(pathToCreate, null, ' ')

  const openFile = fs.openSync(pathToFileJSON, 'w')
  fs.writeSync(openFile, pathToProject, 0, 'utf-8')
  fs.closeSync(openFile)
}
