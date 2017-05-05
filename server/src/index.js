/**
 * Run a web server to serve the SPDZ gui and a REST endpoint to get gui config at run time.
 */
'use strict'

const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const compression = require('compression')
const proxyConfig = require('../config/spdzProxy.json')
const diners = require('./diners')
const certs = require('../certs/config.json')
const configForEnv = require('./configForEnv')
const logger = require('./logging')
const webRouting = require('./webRouting')

const environ = process.env.NODE_ENV || 'development'

logger.debug(`Starting GUI server in ${environ}.`)

const app = express()

// Configure web server paths
webRouting(app)

let webServer
let guiPortNum

// Configure web server
if ( certs.https && certs.https === true ) {
  const httpsOptions = {
    key: fs.readFileSync(certs.keyFile),
    cert: fs.readFileSync(certs.certFile)
  }
  webServer = https.createServer(httpsOptions, app)
  guiPortNum = '8443'
} else {
  webServer = http.createServer(app)
  guiPortNum = (environ === 'development') ? '3001' : '8080'
}

// Setup server web socket
diners.init(webServer)

webServer.listen(guiPortNum, () => {
  logger.info(`Serving GUI on port ${guiPortNum}.`)
})

