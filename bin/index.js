#!/usr/bin/env node
const test    = require('../src/testRun')
const stop    = require('../src/stop')
const start   = require('../src/start')
const setup   = require('../src/setup')
const remove  = require('../src/remove')
const program = require('commander')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('CLI for light development with DC protocol')

program
  .command('setup')
  .description('Setup DC Development ENV')
  .action(cmd => setup(program.args[0]))

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
  .action(cmd => stop(cmd))

program
  .command('test')
  .description('Start testing with options')
  .usage('[options]')
  .option('-u, --unit', 'Start unit tests')
  .option('-p, --performance', 'Start performance tests')
  .option('-i, --integration', 'Start integration tests')
  .action(cmd => test(cmd))

program.parse(process.argv)