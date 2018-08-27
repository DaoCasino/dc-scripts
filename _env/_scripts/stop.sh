
clear
echo ""
echo " * Stop DC docker containers... "
echo ""

cd `dirname "$0"`/../

if [ "$OSTYPE" = linux-gnu ]; then 
  whithSudo="sudo"
else 
  whithSudo=""
fi


$withSudo docker ps || sleep 7

docker-compose down || exit 1
