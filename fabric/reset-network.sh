#!/bin/bash -e
#
# Setzt das ionray-network zurück, also löscht alle Entitäten/Transaktionen darin.
#

composer network reset -c admin@ionray-network
../../fabric/fabric-tools/stopFabric.sh
../../fabric/fabric-tools/teardownFabric.sh
docker system prune -f
rm ./admin@ionray-network.card
../../fabric/fabric-tools/startFabric.sh
