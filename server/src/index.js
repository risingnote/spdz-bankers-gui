/**
 * Run a web server to serve the SPDZ gui and a REST endpoint to get gui config at run time.
 * Expect to be run behind an nginx reverse proxy in prod to provide SSL.
 */
'use strict'

const express = require('express')
const http = require('http')
const diners = require('./diners')
const logger = require('./logging')
const webRouting = require('./webRouting')

const environ = process.env.NODE_ENV || 'development'

logger.debug(`Starting GUI server in ${environ}.`)

const app = express()

// Configure web server paths
webRouting(app)

// Configure web server
const webServer = http.createServer(app)
const guiPortNum = (environ === 'development') ? '3001' : '8080'

// Setup server web socket
diners.init(webServer)

webServer.listen(guiPortNum, () => {
  logger.info(`Serving GUI on port ${guiPortNum}.`)
})

