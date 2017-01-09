/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 * Manage websocket to read and write to list of diners who have joined meal
 *  each diner reports name - displayed, publicKey - unique identifier, paying - optional flag for 'winner'.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

import { sendInputsWithShares } from '../rest_support/SpdzApiHelper'
import BankersForm from './BankersForm'
import BankersTable from './BankersTable'

import './BankersContainer.css'

class BankersContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dinersList: []
    }
    this.handleSubmitBonus = this.handleSubmitBonus.bind(this)
  }

//client
// const Io = require('socket.io-client')
// const socket = new Io()
// socket.on('connect', .....)
// socket.on('disconnect', .....)
// socket.on('players', {})
// socket.emit('joinMeal', {})

  handleSubmitBonus(bonus) {
    sendInputsWithShares([bonus], true, this.props.spdzProxyServerList, this.props.spdzApiRoot, this.props.clientPublicKey )
      .then( () => {
        //TODO create a status message for display 
        console.log('Input sent.')
      })
      .catch((ex) => {
        //TODO create a status message for display (submit failed, see console logs for more information)
        console.log(ex)
      })
  }

  render() {
    const testDiners = [{name: 'me'}, {name: 'Alice'}, {name: 'Bob'}, {name: 'Mal'}, {name: 'Rich', paying: 'true'}]
    //TODO enableSubmit must check proxies connected and not already submitted, based on clientPublicKey.
    return (
      <div className='Bankers'>
        <BankersForm submitBonus={this.handleSubmitBonus} enableSubmit={this.props.allProxiesConnected} />
        <BankersTable diners={testDiners}/>
      </div>
    )
  }
}

BankersContainer.propTypes = {
  allProxiesConnected: React.PropTypes.bool.isRequired,
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired,
  spdzApiRoot: React.PropTypes.string.isRequired,
  clientPublicKey: React.PropTypes.string.isRequired
}

export default BankersContainer
