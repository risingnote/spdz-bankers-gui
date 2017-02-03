/**
 * Responsible for getting available proxies and displaying current SPDZ proxy connection status.
 * Once notified that 'game' has started and until 'game' stopped, polls connection status.
 * Not responsible for connecting/disconnecting to SPDZ proxies.
 * Acts as a higher order component to wrap an MPC GUI component.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus } from './ConnectionContainerHelper' 
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
      this.gameStart = this.gameStart.bind(this)
      this.startMonitorConnectionStatus = this.startMonitorConnectionStatus.bind(this)      
      this.gameStop = this.gameStop.bind(this)      
    }

    /**
     * At startup get list of SPDZ proxies. Generate client key material.
     */
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
     * Notify that at start of 'game', update connection status. Start monitor status timer.
     * @param proxyStatusAtStart values list of {id: index of spdzProxyList, status: ProxyStatusCodes}
     */
    gameStart(proxyStatusAtStart) {
      if (this.state.spdzProxyList.size === 0) {
          console.log('No point trying to poll spdz proxies, none found.')
          return
      }

      const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, proxyStatusAtStart)
      this.setState({spdzProxyList: proxyListAfterUpdate}) 

      this.startMonitorConnectionStatus()
    }

    /**
     * Run a timer to monitor SPDZ connection status. Do not attempt reconnection.
     */
    startMonitorConnectionStatus() {
      this.connectionTimerId = setInterval(() => {
        checkProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                                this.state.spdzApiRoot, this.state.clientPublicKey)
            .then( (values) => {
              const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
              this.setState({spdzProxyList: proxyListAfterUpdate}) 
            })
            .catch( (ex) => {
              // Really not expecting this
              console.log('Got an exception in poll status of spdz proxies.', ex)
              clearInterval(this.connectionTimerId)
            })
            
      }, 5000)
    }

    /**
     * Notify that at end of 'game', update connection status. Stop monitor status timer.
     * @param proxyStatusAfterStop values list of {id: index of spdzProxyList, status: ProxyStatusCodes}
     */
    gameStop(proxyStatusAfterStop) {
      if (this.state.spdzProxyList.size === 0) {
          return
      }
      clearInterval(this.connectionTimerId)

      const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, proxyStatusAfterStop)
      this.setState({spdzProxyList: proxyListAfterUpdate}) 
    }

    render() {
      return (
        <div className="ConnectionContainer-main">
          <div className="ConnectionContainer-mpcgui">
              <MPCGui startGame={this.gameStart}
                      stopGame={this.gameStop}
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
