#!/usr/bin/env bash
sh `dirname "$0"`/check_docker.sh || exit 1

SERVICE_NAME=$1
RECREATE=$2

cd `dirname "$0"`/../
if [ ! "$(docker ps -q -f name=$SERVICE_NAME)" ]
then
	docker-compose up -d $SERVICE_NAME
else
	rm -rf ./protocol/build ./protocol/dapp.contract.json
	docker-compose up -d $RECREATE $SERVICE_NAME
fi

cd `dirname "$0"`/../../
npm run migrate