/**
 * Responsible for managing data and behaviour for SPDZ proxy connections.
 * Acts as a higher order component to wrap an MPC GUI component.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus, allProxiesConnected } from './SetupContainerHelper' 
import Setup from './Setup'
import { getProxyConfig } from '../rest_support/SpdzApi'
import connectToSpdzProxies from '../rest_support/SpdzApiHelper'
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
      this.handleSetupClick = this.handleSetupClick.bind(this)
    }

    componentDidMount() {
      getProxyConfig() 
        .then((json) => {
          const spdzProxyList = initSpdzServerList(json.spdzProxyList)
          this.setState({spdzApiRoot: json.spdzApiRoot})          
          this.setState({spdzProxyList: spdzProxyList})
        })
        .catch((ex) => {
          console.log(ex)
        })

      this.setState({clientPublicKey: createClientPublicKey()})
    }

    handleSetupClick(e) {
      e.preventDefault()

      connectToSpdzProxies(this.state.spdzProxyList.map( spdzProxy => spdzProxy.get('url')), 
                           this.state.spdzApiRoot, this.state.clientId)
        .then( (values) => {
          const proxyListAfterUpdate = updateSpdzServerStatus(this.state.spdzProxyList, values)
          this.setState({spdzProxyList: proxyListAfterUpdate}) 
        })
        .catch( (ex) => {
          // Really not expecting this
          console.log('Got an exception when running connect to spdz proxies.', ex)
        })
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
              <Setup setupForRun={this.handleSetupClick} spdzProxyServerList={this.state.spdzProxyList}/>
          </div>
        </div>
      )
    }
  }
}

export default SetupWrapper
