# SPDZ Bankers 
![SPDZ Logo](https://github.com/bristolcrypto/spdz-bankers-gui/blob/master/client/src/spdz_logo.svg)

Demonstrator using SPDZ to solve the bankers bonus (aka millionaires) problem.

## Dev environment

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
See the following [detailed instructions](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for configuration and use.

The project contains two projects in directories; `client` holding the dev GUI code and `server` holding the 
the node server which serves the GUI in production and a config REST endpoint.

After downloading, `npm install` in both the client and server directories to pull down dependencies. Requires a node/npm installation. Developed and tested against node v7.1.0.

To run a version of the GUI during dev so that changes can be viewed in the browser:

Run the GUI server to serve config (not the GUI):

 `cd server ; npm start`

Run webpack dev server to service the GUI and perform hot reloads:

`cd client ; npm start`

Run tests with: 

`cd client ; npm test`

## Dev integration test

To run all components on a single host for development integration testing.

**SPDZ**

Run the compiled bankers_bonus.mpc program on 2 SPDZ engines from within the [SPDZ](https://github.com/bristolcrypto/SPDZ) directory with:

`Scripts/run-online.sh bankers_bonus`

by default this runs 2 instances on the localhost listening on ports 14000 and 14001.

**SPDZ Proxy**

Run 2 instances of the [SPDZ Proxy](https://github.com/bristolcrypto/spdz-proxy) process, one for each SPDZ engine.
See the [README](https://github.com/bristolcrypto/spdz-proxy/blob/master/README.md) for more information.  

**SPDZ GUI**

Run the [SPDZ GUI server](https://github.com/bristolcrypto/spdz-bankers-gui/tree/master/server) to provide the /spdzProxyConfig REST endpoint and socket server.

Run the webpack served GUI (see above).
