clear
echo 'Contract generate'
cd `dirname "$0"`/../_env/

echo 'Docker up'
docker-compose up -d dc_protocol || sleep 3

echo 'Migrate contracts'
cd ../
npm run migrate || sleep 3

cd `dirname "$0"`/../_env/
docker-compose down || sleep 3