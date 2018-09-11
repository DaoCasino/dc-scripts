#!/usr/bin/env node
const path    = require('path')
const test    = require('../src/testRun')
const start   = require('../src/start')
const setup   = require('../src/setup')
const Utils   = require('../src/Utils')
const remove  = require('../src/remove')
const stopENV = require('../src/stopENV')
const program = require('commander')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('CLI for light development with DC protocol')

program
  .command('setup [dir]')
  .option('-y, --yarn', 'Use yarn package manager for install dependencies')
  .action((dir, cmd) => setup(cmd, dir))

program
  .command('uninstall')
  .description('Uninstall DC Development ENV')
  .action(cmd => remove(cmd))

program
  .command('start')
  .description('Start env for development with options')
  .option('-p, --protocol', 'Start without bankroller-container')
  .action(cmd => start(cmd))

program
  .command('stop')
  .description('stop env for development')
  .action(cmd => stopENV(cmd)
    .then(() => Utils.rmFolder(path.join(process.cwd(), 'protocol')))
    .catch(err => {
      console.error(err)
      process.exit(1)
    }))

program
  .command('test')
  .description('Start testing with options')
  .usage('[options]')
  .action(cmd => test.Unit(cmd))

program.parse(process.argv)