#!/usr/bin/env node
const program = require('commander')
const test  = require('../src/test')
const stop  = require('../src/stop')
const start = require('../src/start')

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .description('CLI for light development with DC protocol')

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
  .action(cmd => test(cmd))

program.parse(process.argv)