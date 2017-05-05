#!/bin/bash

docker run -d --rm --name bankers-bonus-gui -p 443:8443 -e "LOG_LEVEL=debug" -v /opt/spdz/certs:/usr/app/certs -v /opt/spdz/gui-config:/usr/app/config -v /opt/spdz/logs:/usr/app/logs spdz/bankers-bonus-gui:v0.3.0
