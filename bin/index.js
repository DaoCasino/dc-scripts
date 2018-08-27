#!/usr/bin/env node
const program = require('commander')
const test    = require('../src/Test')

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
  .command('test')
  .description('Start testing with options')
  .action(cmd => test(cmd))

program.parse(process.argv)