/**
 * Run the socket io server to manage list of diners.
 * Only allowed to join meal once.
 * Currently clients are stateless so a page refresh will be a disconnect and join.
 */
'use strict'

const logger = require('./logging')
const Io = require('socket.io')
// Hold list of diners who have joined meal with fields; id, name, publicKey
let dinerList = []

// Remove socket id before sending to clients.
const dinerDisplay = () => {
  return dinerList.map(diner => {return {'name': diner.name, 'publicKey': diner.publicKey} })
}

const joinMeal = ((ns, socket, msg, resultCallback) => {
    if (!msg.hasOwnProperty('name') || !msg.hasOwnProperty('publicKey')) {
      const errMsg = `Wrong message format from diner, received ${msg}.`
      logger.warn(errMsg)
      resultCallback(errMsg)
    } else {
      const diner = dinerList.find(diner => diner.id === socket.id)
      if (diner !== undefined) {
        const errMsg = `Diner has already joined as ${diner.name} cannot join again.`
        logger.warn(errMsg)
        resultCallback(errMsg)        
      } else {
        dinerList.push({id: socket.id, name: msg.name, publicKey: msg.publicKey})
        resultCallback()
        ns.emit('diners', dinerDisplay())  
        logger.debug('Diner joined with id ' + socket.id)
      }
    }
})

const resetGame = ((ns, socket, resultCallback) => {
    dinerList = []
    resultCallback()
    ns.emit('diners', dinerDisplay())
    logger.info('Resetting game, all diners removed.')
})

// const disconnect = ((ns, socket) => {
//     const index = dinerList.findIndex(diner => diner.id === socket.id)  
//     if (index > -1) {
//       dinerList.splice(index, 1)
//       socket.disconnect()
//       logger.debug('Diner disconnected with id ' + socket.id)
//       ns.emit('diners', dinerDisplay())         
//     } else {
//       socket.disconnect()
//       logger.debug('Diner disconnected (without joining meal) with id ' + socket.id)
//     }
// })

module.exports = {
  init: (httpServer) => {
    const io = new Io(httpServer)
    const ns = io.of('/diners')
    logger.info('Listening for web socket connections.')

    ns.on('connection', (socket) => {

      socket.emit('diners', dinerDisplay())         

      socket.on('joinMeal', (msg, resultCallback) => {
        joinMeal(ns, socket, msg, resultCallback)
      })

      socket.on('resetGame', (resultCallback) => {
        resetGame(ns, socket, resultCallback)
      })

      // socket.once('disconnect', () => {
      //   disconnect(ns, socket)
      // })
    });
  }
}
