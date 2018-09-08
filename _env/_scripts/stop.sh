sh `dirname "$0"`/check_docker.sh || exit 1

cd `dirname "$0"`/../
function down () {
  docker-compose down
}

trap down exit