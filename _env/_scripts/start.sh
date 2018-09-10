#!/usr/bin/env bash
sh `dirname "$0"`/check_docker.sh || exit 1

RECREATE=$1
WHITH_SUDO=""
SERVICE_NAME=$2

if [ $(uname) = Linux ]; then 
  WITH_SUDO="sudo"
fi

cd `dirname "$0"`/../
if [ ! "$(docker ps -q -f name=$SERVICE_NAME)" ]
then
	$WITH_SUDO docker-compose up -d $RECREATE $SERVICE_NAME
else
	[ ! -z "$RECREATE" ] && rm -rf ./protocol/build ./protocol/dapp.contract.json
	$WITH_SUDO docker-compose up -d $RECREATE $SERVICE_NAME
fi

cd `dirname "$0"`/../../
$WITH_SUDO npm run migrate