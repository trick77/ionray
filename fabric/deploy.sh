#!/bin/sh
#
# Deployt initial das BNA (Business Network Archive) in Hyperledger Fabric.
#
composer network install -a dist/ionray.bna -c PeerAdmin@hlfv1
composer network start -n ionray-network -c PeerAdmin@hlfv1 -V 1.0.0 -A admin -S adminpw
composer card import -f admin@ionray-network.card
composer network list -c admin@ionray-network
