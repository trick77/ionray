#!/bin/sh
#
# Setzt Fabric Parameter und delegiert den eigentlich Start an das entsprechende Composer Skript.
#

export FABRIC_VERSION=hlfv11
export FABRIC_START_TIMEOUT=15
 ../../fabric/fabric-tools/startFabric.sh
