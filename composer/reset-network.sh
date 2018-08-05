#!/bin/bash
#
# Setzt das ionray-network zurück, also löscht alle Entitäten/Transaktionen darin.
#

composer network reset -c admin@ionray-network
../../fabric/fabric-tools/stopFabric.sh
../../fabric/fabric-tools/teardownFabric.sh
docker system prune -f
rm ./admin@ionray-network.card
docker rmi $(docker images |grep 'example')
docker volume rm `docker volume ls -q -f dangling=true`
#../../fabric/fabric-tools/startFabric.sh
