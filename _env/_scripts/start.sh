#!/usr/bin/env bash -e
sh `dirname "$0"`/check_docker.sh || exit 1

cd `dirname "$0"`/../

# First run check and notice
mkdir -p ./tmp
file="./tmp/run.txt"
if [ -f "$file" ]
	then
		echo ""
	else
		echo "first_run" > $file
		clear
		sh _scripts/hello.sh || exit 1
fi



clear
echo ""
echo " * Run DaoCasino protocol in TestRPC(ganache) and bankroller-node"
echo ""
mkdir -p ./protocol

if [ "$OSTYPE" = linux-gnu ]; then 
  whithSudo = "sudo"
else 
  whithSudo = ""
fi

$withSudo docker ps || sleep 7

docker-compose up -d