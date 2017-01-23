/**
 * Responsible for managing data and behaviour for SPDZ proxy connections.
 * Connections are polled for on a timer.
 * Acts as a higher order component to wrap an MPC GUI component.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus, allProxiesConnected } from './SetupContainerHelper' 
import Setup from './Setup'
import { getProxyConfig } from '../rest_support/SpdzApi'
import { connectToProxies, checkProxies } from '../rest_support/SpdzApiAggregate'
import { createClientPublicKey } from '../crypto/cryptoLib'
import './SetupContainer.css'

function SetupWrapper(MPCGui) {
  return class SetupContainer extends Component {
    constructor (props) {
      super(props)
      this.state = {
        clientPublicKey : '',
        spdzApiRoot : "/",
        spdzProxyList : List()
      }
      this.connectionTimerId = undefined
      this.setupAndPollSpdzConnections = this.setupAndPollSpdzConnections.bind(this)      
    }

    componentDidMount() {
      getProxyConfig() 
        .then((json) => {
          const spdzProxyList = initSpdzServerList(json.spdzProxyList)
          this.setState({spdzApiRoot: json.spdzApiRoot})          
          this.setState({spdzProxyList: spdzProxyList})

          this.setState({clientPublicKey: createClientPublicKey()})

          this.setupAndPollSpdzConnections()
        })
        .catch((ex) => {
          console.log(ex)
        })
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

    render() {
      return (
        <div className="SetupContainer-main">
          <div className="SetupContainer-mpcgui">
              <MPCGui allProxiesConnected={allProxiesConnected(this.state.spdzProxyList)} 
                      spdzProxyServerList={this.state.spdzProxyList}
                      spdzApiRoot={this.state.spdzApiRoot}
                      clientPublicKey={this.state.clientPublicKey}/>
          </div>
          <div className="SetupContainer-setup">
              <Setup spdzProxyServerList={this.state.spdzProxyList}/>
          </div>
        </div>
      )
    }
  }
}

export default SetupWrapper
