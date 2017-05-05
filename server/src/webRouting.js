/**
 * Manage express routing for web server.
 */
const compression = require('compression')
const express = require('express')
const path = require('path')
const clientProxyConfig = require('../config/spdzProxy')

const environ = process.env.NODE_ENV || 'development'

module.exports = (app) => {
  // REST endpoints come first
  app.get('/spdzProxyConfig', (req, res) => {
    res.json(clientProxyConfig)
  })

  // Here to allow manual testing of web sockets interface, only in dev.
  if (environ === 'development') {
    app.get('/websocket', (req, res) => {
      res.sendFile(__dirname + '/websocket-test.html');
    })
  }

  // Serve GUI from bundled production build files if not in development.
  // Note catch all to support html 5 history API
  if (environ !== 'development') {
    app.use(compression())  
    app.use(express.static(__dirname + '/../gui_build'))
    app.get('/*', function (req, res) {
      res.sendFile(path.join(__dirname, '/../gui_build', 'index.html'))
    }); 
  }

  app.disable('x-powered-by')
}