/**
 * Responsible for getting available proxies and displaying current SPDZ proxy connection status.
 * Once notified that 'game' has started and until 'game' stopped, polls connection status.
 * Acts as a higher order component to wrap an MPC GUI component.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus, allProxiesConnected } from './ConnectionContainerHelper' 
import Connection from './Connection'
import { getProxyConfig } from '../rest_support/SpdzApi'
import { checkProxies } from '../rest_support/SpdzApiAggregate'
import { createClientPublicKey } from '../crypto/cryptoLib'
import './ConnectionContainer.css'

function ConnectionWrapper(MPCGui) {
  return class ConnectionContainer extends Component {
    constructor (props) {
      super(props)
      this.state = {
        clientPublicKey : '',
        spdzApiRoot : "/",
        spdzProxyList : List()
      }
      this.connectionTimerId = undefined
      this.setupAndPollSpdzConnections = this.setupAndPollSpdzConnections.bind(this)      
      this.stopSpdzConnections = this.stopSpdzConnections.bind(this)      
    }

    componentDidMount() {
      getProxyConfig() 
        .then((json) => {
          const spdzProxyList = initSpdzServerList(json.spdzProxyList)
          this.setState({spdzApiRoot: json.spdzApiRoot})          
          this.setState({spdzProxyList: spdzProxyList})

          this.setState({clientPublicKey: createClientPublicKey()})
        })
        .catch((ex) => {
          console.log(ex)
        })
    }

    /**
     * Try to connect to SPDZ servers at start of 'game'.
     */
    setupSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          console.log('No point trying to setup connect and poll spdz proxies, none found.')
          return
      }
      this.connectionTimerId = setInterval(() => {
        const allConnected = allProxiesConnected(this.state.spdzProxyList)

        const connectionPromise = (allConnected) ? 
            checkProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey) :
            connectToProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey)

        connectionPromise                                
            .then( (values) => {
              const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
              this.setState({spdzProxyList: proxyListAfterUpdate}) 
            })
            .catch( (ex) => {
              // Really not expecting this
              console.log('Got an exception in setup/poll status of spdz proxies.', ex)
              clearInterval(this.connectionTimerId)
            })
            
      }, 5000)
    }

    /**
     * Start an interval timer to maintain connection to SPDZ proxies.
     * If not connected, try connecting. 
     * If already connected, check connection status.
     */
    setupAndPollSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          console.log('No point trying to setup connect and poll spdz proxies, none found.')
          return
      }
      this.connectionTimerId = setInterval(() => {
        const allConnected = allProxiesConnected(this.state.spdzProxyList)

        const connectionPromise = (allConnected) ? 
            checkProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey) :
            connectToProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey)

        connectionPromise                                
            .then( (values) => {
              const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
              this.setState({spdzProxyList: proxyListAfterUpdate}) 
            })
            .catch( (ex) => {
              // Really not expecting this
              console.log('Got an exception in setup/poll status of spdz proxies.', ex)
              clearInterval(this.connectionTimerId)
            })
            
      }, 5000)
    }

    /**
     * Send a close command to each SPDZ proxy to indicate game is over (connection may already be ended.)
     * Stop polling connection status.
     */
    stopSpdzConnections() {
      if (this.state.spdzProxyList.size === 0) {
          return
      }
      clearInterval(this.connectionTimerId)

      disconnectFromProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                          this.state.spdzApiRoot, this.state.clientPublicKey)
        .then( (values) => {
          const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
          this.setState({spdzProxyList: proxyListAfterUpdate}) 
        })
        .catch( (ex) => {
          // Really not expecting this
          console.log('Got an exception in setup/poll status of spdz proxies.', ex)
          clearInterval(this.connectionTimerId)              
        })
    }

    render() {
      return (
        <div className="ConnectionContainer-main">
          <div className="ConnectionContainer-mpcgui">
              <MPCGui allProxiesConnected={allProxiesConnected(this.state.spdzProxyList)}
                      startGame={this.setupAndPollSpdzConnections}
                      stopGame={this.stopSpdzConnections}
                      spdzProxyServerList={this.state.spdzProxyList}
                      spdzApiRoot={this.state.spdzApiRoot}
                      clientPublicKey={this.state.clientPublicKey}/>
          </div>
          <div className="ConnectionContainer-setup">
              <Connection spdzProxyServerList={this.state.spdzProxyList}/>
          </div>
        </div>
      )
    }
  }
}

export default ConnectionWrapper
