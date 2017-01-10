/**
 * Run a web server to serve the SPDZ gui and a REST endpoint to get gui config at run time.
 */
'use strict'

const express = require('express')
const http = require('http')
const compression = require('compression')
const guiConfig = require('../config/spdzGui.json')
const proxyConfig = require('../config/spdzProxy.json')
const diners = require('./diners')

const guiPortNum = guiConfig.portNum || '8080'
const environ = process.env.NODE_ENV || 'development'

const app = express()

// Serve GUI from bundled production build files if not in development.
if (environ !== 'development') {
  app.use(compression())  
  app.use(express.static(__dirname + '/../../client/build'))
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../client/build', 'index.html'))
  }); 
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
