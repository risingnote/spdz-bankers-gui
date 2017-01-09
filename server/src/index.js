/**
 * Run a web server to serve the SPDZ gui and a REST endpoint to get gui config at run time.
 */
'use strict'

const express = require('express')
const http = require('http')
const guiConfig = require('../config/spdzGui.json')
const proxyConfig = require('../config/spdzProxy.json')
const diners = require('./diners')

const guiPortNum = guiConfig.portNum || '8080'
const environ = process.env.NODE_ENV || 'development'

const app = express()

// Do not use express to serve GUI in development
if (environ !== 'development') {
  app.use(express.static('../../client/build'))
}

app.get('/spdzProxyConfig', (req, res) => {
  res.json(proxyConfig)
})

// Here to allow manual testing of web sockets interface, only in dev.
if (environ === 'development') {
  app.get('/websocket', (req, res) => {
    res.sendFile(__dirname + '/websocket-test.html');
  })
}

app.disable('x-powered-by')

// TODO Allow optional switch to https
const httpServer = http.createServer(app)

// Setup server web socket
diners.init(httpServer)

httpServer.listen(guiPortNum, () => {
  console.log('Serving gui on port ' + guiPortNum + '.')
})
