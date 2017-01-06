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
const httpServer = http.createServer(app)

httpServer.listen(guiPortNum, () => {
  console.log('Serving gui on port ' + guiPortNum + '.')
})

// var Io = require('socket.io')
// var io = new Io(httpServer)
// io.listen(guiPortNum)
// io.on('connection', (socket) => {
//   socket.once('disconnect', () => {
//     connections.splice(connections.indexof(socket), 1)
//     socket.disconnect()
//   })
//   console.log('a user connected' + socket.id;
//   connections.push(socket) // store socket for broadcast
//
//   socket.on('players', (msg) => {
//     build list off all players  
//     io.emit('new player list', msg) 
//   })
// });


//client
// const Io = require('socket.io-client')
// const socket = new Io()
// socket.on('connect', .....)
// socket.on('disconnect', .....)
// socket.on('players', {})
// socket.emit('new player', {})

