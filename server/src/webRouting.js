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
  app.get('/bankers/spdzProxyConfig', (req, res) => {
    res.json(clientProxyConfig)
  })

  // Here to allow manual testing of web sockets interface, only in dev.
  if (environ === 'development') {
    app.get('/websocket', (req, res) => {
      res.sendFile(__dirname + '/websocket-test.html');
    })
  }

  // Serve GUI from bundled production build files if not in development.
  if (environ !== 'development') {
    app.use(compression())
    // This is middleware, if it can resolve the request from the file system it 
    // will return the file, otherwise call next to move on to routes.   
    app.use('/bankers', express.static(__dirname + '/../gui_build'))
    // This is router middleware, and will match all other requests to index.html, which is
    // what we want to support client side routing. 
    app.get('/bankers/*', function (req, res) {
      res.sendFile(path.join(__dirname, '/../gui_build', 'index.html'))
    }); 
  }

  app.disable('x-powered-by')
}