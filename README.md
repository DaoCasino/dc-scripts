# dc-scripts | Command line interface for lith init, develop, test and release DC-PROTOCOL

## install
___
Add rsa in config.fish or .bash_profile, in order to do not import passphrase everytime
```shell
  # in config.fish or .bash_profile
  ssh-add -K ~/.ssh/[name_to_rsa_private_key]

  # Example
  ssh-add -K ~/.ssh/id_rsa
```
Install dc-scripts

With npm
```shell
  npm install daocasino/dc-scripts -g
```
With yarn
```shell
  yarn global add daocasino/dc-scripts
```
___
## API
___
### Help
```shell
  Usage: dc-scripts <command> [options]

  CLI for light development with DC protocol

  Options:

    -V, --version    output the version number
    -h, --help       output usage information

  Commands:

    setup            Setup DC Development ENV
    uninstall        Uninstall DC Development ENV
    start [options]  Start env for development with options
    stop             stop env for development
    test [options]   Start testing with options
```

### Setup protocol
```shell
  dc-scripts setup [directory_name]
```
### Uninstall protocol
```shell
  dc-scripts uninstall
```
### Start/Stop DC Protocol contracts
```shell
  # on start
  dc-scripts start
  # start without bankroller docker container
  dc-scripts start -p

  # stop
  dc-scripts stop
```
### Tests run
```shell
  # start unit tests in test folder project
  dc-scripts test
  # or
  dc-scripts test -u

  # start integration tests for testing all sdk
  dc-scripts test -i
```