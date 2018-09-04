echo 'Contract generate'
cd ./_env

echo 'Docker up'
docker-compose up -d dc_protocol || sleep 3
clear

echo 'Migrate contracts'
cd ../
npm run migrate