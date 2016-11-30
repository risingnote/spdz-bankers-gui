/**
 * Run a web server to serve the SPDZ gui and a REST endpoint to get gui config at run time.
 */
'use strict'

const express = require('express')
const http = require('http')
const guiConfig = require('../config/spdzGui.json')
const proxyConfig = require('../config/spdzProxy.json')

const guiPortNum = guiConfig.portNum || '8080'
const environ = process.env.NODE_ENV || 'development'

const app = express()

// Do not use express to serve GUI in development
if (process.env.NODE_ENV !== 'development') {
  app.use(express.static('../../client/build'));
}

app.get('/spdzProxyConfig', (req, res) => {
  res.json(proxyConfig)
})

app.disable('x-powered-by')

// TODO Allow optional switch to https
http.createServer(app).listen(guiPortNum, () => {
  console.log('Serving gui on port ' + guiPortNum + '.')
})
