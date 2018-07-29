#!/bin/sh
#
# Stellt unter port tcp/3000 ein REST API für das ionray-network zur Verfügung,
# womit die Clients dieses Business Netzwerks interagieren können.
#

screen -dm composer-rest-server -c admin@ionray-network -n always -w true &


