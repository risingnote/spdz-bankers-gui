/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 * Interacts with GUI via websocket to read and write list of diners who have joined meal.
 * Interacts with SPDZ to send shares of data and poll for result.
 */
import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import Io from 'socket.io-client'

import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/flip.css'

import { connectToProxies, disconnectFromProxies } from '../rest_support/SpdzApiAggregate'
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
    this.handleSubmitEntry = this.handleSubmitEntry.bind(this)
    this.joinMeal = this.joinMeal.bind(this)
    this.pollForResult = this.pollForResult.bind(this)
  }

  /**
   * At startup get list of diners who have already joined the meal.
   */
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
    disconnectFromProxies(this.props.spdzProxyServerList.map( spdzProxy => spdzProxy.get('url')), 
                          this.props.spdzApiRoot, this.props.clientPublicKey)
  }

  /**
   * Start an interval timer to poll the SPDZ proxies for the winner of the computation.
   * If successfully get result:
   *   Disconnect from SPDZ engines and notify ConnectionContainer.
   */
  pollForResult(spdzProxyServerList, spdzApiRoot, clientPublicKey) {
    this.resultTimerId = setInterval(() => {
      retrieveWinnerClientId(spdzProxyServerList, spdzApiRoot, clientPublicKey)
      .then( winningClientId => {
        this.setState({winningClientId: winningClientId})
        console.log('Got winning client of ', winningClientId)        
        clearInterval(this.resultTimerId)
      })
      .then( () => {
        return disconnectFromProxies(this.props.spdzProxyServerList.map( spdzProxy => spdzProxy.get('url')), 
                          this.props.spdzApiRoot, this.props.clientPublicKey)
      })
      .then( (values) => {
        this.props.stopGame(values)
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
   * Join game by:
   *   Running connection to SPDZ engines and notifying ConnectionContainer.
   *   If all OK join meal with a name
   *   If all OK send bonus as shares to all SPDZ proxies.
   *   Start timer polling for result.
   */
  handleSubmitEntry(name, bonus) {
    connectToProxies(this.props.spdzProxyServerList.map( spdzProxy => spdzProxy.get('url')), 
                                this.props.spdzApiRoot, this.props.clientPublicKey)
      .then( (values) => {
        this.props.startGame(values)
        return this.joinMeal(this.socket, name, this.props.clientPublicKey)
      })
      .then( () => {
        return sendInputsWithShares([bonus], true, this.props.spdzProxyServerList, 
              this.props.spdzApiRoot, this.props.clientPublicKey)
      })
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
    const winnerChosen = this.state.winningClientId !== undefined
    const connectionProblem = this.props.spdzProxyServerList.size === 0 ? "No SPDZ servers found." : undefined

    return (
      <div className='Bankers'>
        <BankersForm submitBonus={this.handleSubmitEntry} joinedName={joinedName} 
                     winnerChosen={winnerChosen} connectionProblem={connectionProblem}/>
        <BankersTable diners={this.state.dinersList} winningClientId={this.state.winningClientId}/>
        <Alert stack={{limit: 3}} timeout={5000} position={'top-left'} effect={'flip'} offset={100} html={true} />
      </div>
    )
  }
}

BankersContainer.propTypes = {
  startGame: PropTypes.func.isRequired,
  stopGame: PropTypes.func.isRequired,  
  spdzProxyServerList: PropTypes.instanceOf(List).isRequired,
  spdzApiRoot: PropTypes.string.isRequired,
  clientPublicKey: PropTypes.string.isRequired
}

export default BankersContainer
