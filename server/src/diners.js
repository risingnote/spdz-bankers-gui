/**
 * Run the socket io server to manage list of diners.
 * Only allowed to join meal once.
 * Currently clients are stateless so a page refresh will be a disconnect and join.
 */
'use strict'

const Io = require('socket.io')
// Hold list of diners who have joined meal with fields; id, name, publicKey
let dinerList = []

// Remove socket id before sending to clients.
const dinerDisplay = () => {
  return dinerList.map(diner => {return {'name': diner.name, 'publicKey': diner.publicKey} })
}

const joinMeal = ((ns, socket, msg, errorCallback) => {
    if (!msg.hasOwnProperty('name') || !msg.hasOwnProperty('publicKey')) {
      const errMsg = `Wrong message format from diner, received ${msg}.`
      console.log(errMsg)
      errorCallback(errMsg)
    } else {
      const diner = dinerList.find(diner => diner.id === socket.id)
      if (diner !== undefined) {
        const errMsg = `Diner has already joined as ${diner.name} cannot join again.`
        console.log(errMsg)
        errorCallback(errMsg)        
      } else {
        dinerList.push({id: socket.id, name: msg.name, publicKey: msg.publicKey})
        ns.emit('diners', dinerDisplay())         
      }
    }
})

const disconnect = ((ns, socket) => {
    const index = dinerList.findIndex(diner => diner.id === socket.id)  
    if (index > -1) {
      dinerList.splice(index, 1)
      socket.disconnect()
      console.log('Diner disconnected with id ' + socket.id)
      ns.emit('diners', dinerDisplay())         
    } else {
      socket.disconnect()
      console.log('Diner disconnected (without joining meal) with id ' + socket.id)
    }
})

module.exports = {
  init: (httpServer) => {
    const io = new Io(httpServer)
    const ns = io.of('/diners')
    console.log('Listening for web socket connections.')

    ns.on('connection', (socket) => {

      console.log('Got a diner connected with id ' + socket.id)
      socket.emit('diners', dinerDisplay())         

      socket.on('joinMeal', (msg, errorCallback) => {
        joinMeal(ns, socket, msg, errorCallback)
      })

      socket.once('disconnect', () => {
        disconnect(ns, socket)
      })
    });
  }
}
