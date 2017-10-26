/**
 * Responsible for managing behaviour around form submission for the bankers GUI.
 * Manages websocket connections to maintain list of diners.
 * Polls for a result once meal is joined.
 * Interacts with SPDZ to send shares of data and poll for result.
 */
import React, { Component, PropTypes } from 'react'
import Io from 'socket.io-client'

/* Import REST functions from detailed entry point to avoid pulling in unused functions. */
import { connectToSPDZ, disconnectFromSPDZ, allProxiesConnected, 
         sendInputsWithShares, retrieveRegIntsAsHexString, NoContentError } from 'spdz-gui-lib/dist/rest_api'

import BankersForm from './BankersForm'

class BankersFormContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dinersList: [],
      socket: undefined,
      winningClientId: undefined
    }
    this.resultTimerId = undefined
    this.handleSubmitEntry = this.handleSubmitEntry.bind(this)
    this.resetGame = this.resetGame.bind(this)
    this.joinMeal = this.joinMeal.bind(this)
    this.pollForResult = this.pollForResult.bind(this)
  }

  /**
   * At startup get list of diners who have already joined the meal.
   */
  componentDidMount() {
    const socket = Io('/diners', {path: '/bankers/socket.io'})
    this.setState({socket: socket})

    // Expect list of {name: <somename>, publicKey: <key>}
    socket.on('diners', (msg) => {
      this.setState({dinersList: msg})
      if (msg.length === 0) { //indicates game reset as all diners removed
        this.setState({winningClientId: undefined})
        this.props.changeToDiners(msg, undefined)        
        console.log('All game players reset.')       
      } else {
        this.props.changeToDiners(msg, this.state.winningClientId)        
      }
    });
  }

  componentWillUnmount() {
    // this.state.socket.on('disconnect', () => {})
    if (this.resultTimerId !== undefined) {
      clearInterval(this.resultTimerId)
      this.resultTimerId = undefined
    } 
    disconnectFromSPDZ(this.props.spdzProxyServerList, this.props.spdzApiRoot)
  }

  /**
   * Start an interval timer to poll the SPDZ proxies for the winner of the computation.
   * If successfully get result:
   *   Disconnect from SPDZ engines and notify change of connection status.
   */
  pollForResult(spdzProxyServerList, spdzApiRoot) {
    this.resultTimerId = setInterval(() => {
      retrieveRegIntsAsHexString(spdzProxyServerList, spdzApiRoot, 8, true)
      .then( winningClientId => {
        this.setState({winningClientId: winningClientId})
        this.props.changeToDiners(this.state.dinersList, winningClientId)
        console.log('Got winning client of ', winningClientId)        
        clearInterval(this.resultTimerId)
      })
      .then( () => {
        return disconnectFromSPDZ(this.props.spdzProxyServerList, 
                          this.props.spdzApiRoot)
      })
      .then( (values) => {
        this.props.updateConnectionStatus(values)
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
  joinMeal(name, clientPublicKey) {
    const that = this
    return new Promise(function(resolve, reject) {
      that.state.socket.emit('joinMeal', {name: name, publicKey: clientPublicKey}, function(error) {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
      })
    })
  } 

  /**
   * Reset game by sending websocket message. No attempt to reset SPDZ parties.
   */
  resetGame() {
    this.state.socket.emit('resetGame', function(error) {
        if (error) {
          console.log('Unable to reset game.', error)
        }
    })
  } 

  /**
   * Join game by:
   *   Running connection to SPDZ engines and notifying change of connection status.
   *   If all OK join meal with a name
   *   If all OK send bonus as shares to all SPDZ proxies.
   *   Start timer polling for result.
   */
  handleSubmitEntry(name, bonus, finished) {
    // Here using clientPublicKey as client id.
    connectToSPDZ(this.props.spdzProxyServerList.map( spdzProxy => spdzProxy.url ), 
                                this.props.spdzApiRoot, this.props.clientPublicKey,
                                this.props.clientPublicKey)
      .then( (values) => {
        this.props.updateConnectionStatus(values)
        if (allProxiesConnected(values)) {
          return 
        }
        else {
          return Promise.reject(new Error('Unable to connect to all Spdz Proxy Servers'))
        }
      })
      .then( () => {
        return sendInputsWithShares([bonus, (finished ? 1 : 0)], true, this.props.spdzProxyServerList, 
              this.props.spdzApiRoot, 500)
      })
      .then( () => {
        return this.joinMeal(name, this.props.clientPublicKey)
      })
      .then( () => {
        this.pollForResult(this.props.spdzProxyServerList, this.props.spdzApiRoot)
      })
      .catch((ex) => {
        console.log("Unable to join meal.", ex)
        this.setState({connectionProblem: 'Unable to successfully send bonus to SPDZ parties.'})
      })
  }

  render() {
    const myEntry = this.state.dinersList.find(diner => diner.publicKey === this.props.clientPublicKey)
    const joinedName = (myEntry !== undefined ? myEntry.name : undefined)
    const winnerChosen = this.state.winningClientId !== undefined

    return (
        <BankersForm submitBonus={this.handleSubmitEntry} joinedName={joinedName} 
                     winnerChosen={winnerChosen} resetGame={this.resetGame} connectionProblem={this.state.connectionProblem}/>
    )
  }
}

BankersFormContainer.propTypes = {
  updateConnectionStatus: PropTypes.func.isRequired,
  changeToDiners: PropTypes.func.isRequired,
  spdzProxyServerList: PropTypes.array.isRequired,
  spdzApiRoot: PropTypes.string.isRequired,
  clientPublicKey: PropTypes.string.isRequired
}

export default BankersFormContainer
