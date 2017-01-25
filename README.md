# SPDZ Bankers GUI 
![SPDZ Logo](https://github.com/bristolcrypto/spdz-bankers-gui/blob/master/client/src/spdz_logo.svg)

Demonstrator using SPDZ to solve the bankers bonus (aka millionaires) problem.

## Requirements

- This project is bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). See the following [detailed instructions](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md) for configuration and use.
- node v7.1.0
- other library dependencies are listed in the package.json files. Use `npm install` to pull these down.

## Dev environment

The project contains two directories:

- `client` contains the GUI code which runs in the browser
- `server` contains the node web server which serves a config rest endpoint, shared GUI state via Websockets and serves the GUI in production.

To run a version of the GUI during dev so that changes can be viewed in the browser, follow these steps:

1. Run the node web server to serve config and shared state (not the GUI):

 `cd server ; npm start`

2. Run a webpack dev server to service the GUI and perform hot reloads:

`cd client ; npm start`

3. Run GUI tests with: 

`cd client ; npm test`

## Deployment

*Installation settings for a manual install on a single host.*

To run the GUI the following processes need to be running:

**SPDZ**

Assumes [SPDZ](https://github.com/bristolcrypto/SPDZ) has been installed and built for the target environment.

Generate pre-computed values:

- `Scripts/setup-online.sh` to generate the triples for 2 SPDZ parties/engines, used as validated shares.
- `client-setup 2` to generate the public/private key pairs for each SPDZ party/engine

Run the compiled [bankers_bonus.mpc](https://github.com/bristolcrypto/SPDZ/blob/privateclient/Programs/Source/bankers_bonus.mpc) program on 2 SPDZ engines from within the SPDZ directory with:

`Scripts/run-online.sh bankers_bonus`

by default this runs 2 instances on the localhost listening on ports 14000 and 14001.

**SPDZ Proxy**

Assumes [SPDZ Proxy](https://github.com/bristolcrypto/spdz-proxy)  has been installed on the target environment. 

Run 2 instances of the SPDZ Proxy process, one for each SPDZ engine. See the [README](https://github.com/bristolcrypto/spdz-proxy/blob/master/README.md) for more information. 

**SPDZ GUI**

Ensure node v7.1.0 is installed, suggest using [nvm](https://github.com/creationix/nvm) to manage node versions.

`npm install -g create-react-app` This is needed to build a production version of the GUI. 

`git clone git@github.com:bristolcrypto/spdz-bankers-gui.git`

`npm install ; npm test`

`npm run build`to create the production served version of the GUI.

Update `server/config/spdzProxy.json` with the public keys of each SPDZ engine. Read from the file system with `xxd -c 32 spdz/Player-Data/2-128-40/Player-SPDZ-Keys-Pn` where n is 0 or 1. The server public key is the first line in the file. The wrong value will lead to authentication errors in the GUI when sending input to SPDZ.

Check that the http port is set as required in `server/config/spdzGui.json`.

`cd server; NODE_ENV=production node src/index.js` to run the GUI web server.


