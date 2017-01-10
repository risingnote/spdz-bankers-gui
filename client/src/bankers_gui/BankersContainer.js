/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 * Manage websocket to read and write to list of diners who have joined meal
 *  each diner reports name - displayed, publicKey - unique identifier, paying - optional flag for 'winner'.
 */
import React, { Component } from 'react'
import { List } from 'immutable'
import Io from 'socket.io-client'

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
    this.socket = undefined
    this.handleSubmitBonus = this.handleSubmitBonus.bind(this)
  }

  componentDidMount() {
    this.socket = Io('/diners')

    this.socket.on('diners', (msg) => {
      this.setState({dinersList: msg})
    });
  }

  componentWillUnmount() {
    this.socket.on('disconnect', () => {})
  }

  handleSubmitBonus(name, bonus) {
    this.socket.emit('joinMeal', {name: name, publicKey: this.props.clientPublicKey}, function(error) {
        if (error) console.log(error)
    })
    
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
    const myEntry = this.state.dinersList.find(diner => diner.publicKey === this.props.clientPublicKey)
    const joinedName = (myEntry !== undefined ? myEntry.name : undefined)
    return (
      <div className='Bankers'>
        <BankersForm submitBonus={this.handleSubmitBonus} proxiesConnected={this.props.allProxiesConnected} joinedName={joinedName} />
        <BankersTable diners={this.state.dinersList}/>
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
