#!/usr/bin/env bash
sh `dirname "$0"`/check_docker.sh || exit 1

RECREATE=$1
WHITH_SUDO=""
SERVICE_NAME=$2
NETWORK_NAME=$3

if [ $(uname) = Linux ]; then 
  WITH_SUDO="sudo"
fi

cd `dirname "$0"`/../
$WITH_SUDO docker-compose up -d $RECREATE $SERVICE_NAME

sleep 3