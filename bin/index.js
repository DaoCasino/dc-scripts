#!/usr/bin/env node
const run       = require('../src/run')
const test      = require('../src/testRun')
const setup     = require('../src/setup')
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
  .option('-r, --ropsten', 'Run env in ropsten network')
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

program.parse(process.argv)