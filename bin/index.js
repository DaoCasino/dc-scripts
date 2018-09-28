#!/usr/bin/env node
const run       = require('../src/run')
const logs      = require('../src/logs')
const test      = require('../src/testRun')
const setup     = require('../src/setup')
const deploy    = require('../src/deploy')
const stopENV   = require('../src/stopENV')
const program   = require('commander')
const uninstall = require('../src/uninstall')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('CLI for light development with DC protocol')

program
  .command('setup [dir]')
  /**
   * TOODOO: Bug in yarn install dc-messaging
   * instal this old not working versions
   */
  // .option('-y, --yarn', 'Use yarn package manager for install dependencies')
  .action((dir, cmd) => setup(cmd, dir))

program
  .command('uninstall')
  .description('Uninstall DC Development ENV')
  .action(cmd => uninstall(cmd))

program
  .command('run')
  .description('Start env for development with options')
  .option('-p, --protocol', 'Start without bankroller-container')
  .option('-s, --sdk', 'output contracts with SDK path')
  .option('-f, --force', 'force recreate docker container')
  .action(cmd => run(cmd))

program
  .command('stop')
  .description('stop env for development')
  .action(cmd => stopENV(cmd))

program
  .command('test')
  .description('Start testing')
  .action(cmd => test.Unit(cmd))

program
  .command('deploy <network>')
  .description('Deploy contract with network')
  .action((cmd) => deploy(cmd))

program
  .command('logs <service>')
  .description('Output docker container logs in ENV')
  .action((service) => logs(service))

program.parse(process.argv)