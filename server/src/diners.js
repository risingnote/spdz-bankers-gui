/**
 * Run the socket io server to manage list of diners.
 * Only allowed to join meal once. Note that a page refresh will be a disconnect and join,
 * ideally state should be stored in cookie to overcome this.
 * Or...use publickey as index, only remove if specifically ask with a message i.e. not on disconnect.
 */
'use strict'

const Io = require('socket.io')
let clients = []

//Should dinners list (clients) order be reset as diners join - probably yes.
//or just hold dinerslist, no need for clients??
const dinerList = () => {
  return clients.map(client => {return {'name': client.name, 'publicKey': client.publicKey} })
                    .filter(value => value.name != undefined)
}

const joinMeal = ((ns, socket, msg) => {
    if (!msg.hasOwnProperty('name') || !msg.hasOwnProperty('publicKey')) {
      console.log('Wrong message format from diner, received ', msg)
    } else {
      const client = clients.find(client => client.id === socket.id)
      if (client && client.name !== undefined) {
        console.log(`Diner has already joined as ${client.name} cannot join again.`)
      } else {
        client.name = msg.name
        client.publicKey = msg.publicKey
        ns.emit('dinerList', dinerList())         
      }
    }
})

const disconnect = ((ns, socket) => {
    const index = clients.findIndex(client => client.id === socket.id)  
    if (index > -1) {
      clients.splice(index, 1)
      socket.disconnect()
      console.log('Diner disconnected with id ' + socket.id)
      ns.emit('dinerList', dinerList())               
    } else {
      console.log('Diner cannot be disconnected, cannot find connections.')        
    }
})

module.exports = {
  init: (httpServer) => {
    const io = new Io(httpServer)
    const ns = io.of('/diners')
    console.log('Listening for web socket connections.')

    ns.on('connection', (socket) => {

      console.log('Got a diner connected with id ' + socket.id)
      clients.push({id: socket.id, name: undefined, publicKey: undefined})
      socket.emit('dinerList', dinerList())

      socket.on('joinMeal', (msg) => {
        joinMeal(ns, socket, msg)
      })

      socket.once('disconnect', () => {
        disconnect(ns, socket)
      })
    });
    
  }
}
