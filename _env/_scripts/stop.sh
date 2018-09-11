sh `dirname "$0"`/check_docker.sh || exit 1

WITH_SUDO=""

if [ $(uname) = Linux ]; then 
  WITH_SUDO="sudo"
fi

cd `dirname "$0"`/../
$WITH_SUDO docker-compose down || exit 1