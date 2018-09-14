#!/usr/bin/env node
const Run     = require('../src/Run')
const test    = require('../src/testRun')
const setup   = require('../src/setup')
const remove  = require('../src/remove')
const stopENV = require('../src/stopENV')
const program = require('commander')

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
  .action(cmd => remove(cmd))

program
  .command('run')
  .description('Start env for development with options')
  .option('-p, --protocol', 'Start without bankroller-container')
  .action(cmd => Run(cmd))

program
  .command('stop')
  .description('stop env for development')
  .action(cmd => stopENV(cmd))

program
  .command('test')
  .description('Start testing')
  .action(cmd => test.Unit(cmd))

program.parse(process.argv)