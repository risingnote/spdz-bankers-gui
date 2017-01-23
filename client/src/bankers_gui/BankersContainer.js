/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 * Interacts with GUI via websocket to read and write list of diners who have joined meal.
 * Interacts with SPDZ to send shares of data and poll for result.
 */
import React, { Component } from 'react'
import { List } from 'immutable'
import Io from 'socket.io-client'

import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'

import { sendInputsWithShares, retrieveWinnerClientId } from '../rest_support/SpdzApiHelper'
import NoContentError from '../rest_support/NoContentError'
import BankersForm from './BankersForm'
import BankersTable from './BankersTable'

import './BankersContainer.css'

class BankersContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dinersList: [],
      winningClientId: undefined
    }
    this.socket = undefined
    this.resultTimerId = undefined
    this.handleSubmitBonus = this.handleSubmitBonus.bind(this)
    this.joinMeal = this.joinMeal.bind(this)
    this.pollForResult = this.pollForResult.bind(this)
  }

  componentDidMount() {
    this.socket = Io('/diners')

    // Expect list of {name: <somename>, publicKey: <key>}
    this.socket.on('diners', (msg) => {
      this.setState({dinersList: msg})
    });
  }

  componentWillUnmount() {
    this.socket.on('disconnect', () => {})
    if (this.resultTimerId !== undefined) {
      clearInterval(this.resultTimerId)
      this.resultTimerId = undefined
    } 
  }

  /**
   * Start an interval timer to poll the SPDZ proxies for the winner of the computation.
   */
  pollForResult(spdzProxyServerList, spdzApiRoot, clientPublicKey) {
    this.resultTimerId = setInterval(() => {
      retrieveWinnerClientId(spdzProxyServerList, spdzApiRoot, clientPublicKey)
      .then( winningClientId => {
        this.setState({winningClientId: winningClientId})
        console.log('Got winning client of ', winningClientId)        
        clearInterval(this.resultTimerId)
      })
      .catch( err => {
        if (err instanceof NoContentError) {
          // Keep going, data should turn up.
          console.log('No result data yet.')
        }
        else {
          console.log('Problem when polling for result ', err)
          clearInterval(this.resultTimerId)        
        }
      })
    }, 2000)
  }

  /**
   * Join meal by sending websocket message, wrapped as promise.
   */
  joinMeal(socket, name, clientPublicKey) {
    return new Promise(function(resolve, reject) {
      socket.emit('joinMeal', {name: name, publicKey: clientPublicKey}, function(error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
      })
    })
  } 

  /**
   * Join list of diners and if successful send bonus as shares to each SPDZ proxy.
   */
  handleSubmitBonus(name, bonus) {
    this.joinMeal(this.socket, name, this.props.clientPublicKey)
      .then(() => sendInputsWithShares([bonus], true, this.props.spdzProxyServerList, 
              this.props.spdzApiRoot, this.props.clientPublicKey))
      .then( () => {
        this.pollForResult(this.props.spdzProxyServerList, this.props.spdzApiRoot, 
              this.props.clientPublicKey)
        Alert.info('You have joined the meal.', {html: false})
      })
      .catch((ex) => {
        console.log(ex)
        Alert.error(`<h4>Unable to successfully send bonus to SPDZ proxies.</h4><p>${ex}</p>`, {timeout: 'none'})
      })
  }

  render() {
    const myEntry = this.state.dinersList.find(diner => diner.publicKey === this.props.clientPublicKey)
    const joinedName = (myEntry !== undefined ? myEntry.name : undefined)
    return (
      <div className='Bankers'>
        <BankersForm submitBonus={this.handleSubmitBonus} proxiesConnected={this.props.allProxiesConnected}
                     joinedName={joinedName} />
        <BankersTable diners={this.state.dinersList} winningClientId={this.state.winningClientId}/>
        <Alert stack={{limit: 3}} timeout={5000} position={'top-left'} effect={'flip'} offset={100} html={true} />
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
