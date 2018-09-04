#!/usr/bin/env bash -e
sh `dirname "$0"`/check_docker.sh || exit 1

PROTOCOL_DOCKER="dc_protocol"
BANKROLLER_DOCKER="dc_bankroller"
ARG=$1

cd `dirname "$0"`/../
if [ $ARG == $PROTOCOL_DOCKER ];
then
	if [ ! "$(docker ps -q -f name=$ARG)" ]
	then
		docker-compose up -d $ARG || sleep 3
	fi
else
	docker-compose up -d || sleep 3
fi