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
import './SetupContainer.css'

function SetupWrapper(MPCGui) {
  return class SetupContainer extends Component {
    constructor (props) {
      super(props)
      //Perhaps client id should be Diffie Hellman public key
      this.state = {
        clientId : '0',
        spdzApiRoot : "/",
        spdzProxyList : List()
      }
      this.handleSetupClick = this.handleSetupClick.bind(this)
    }

    componentDidMount() {
      getProxyConfig() 
        .then((json) => {
          this.setState({"spdzApiRoot": json.spdzApiRoot})
          this.setState({"spdzProxyList": initSpdzServerList(json.spdzProxyList)})
        })
        .catch((ex) => {
          console.log(ex)
        })
    }

    handleSetupClick(e) {
      e.preventDefault()

      connectToSpdzProxies(this.state.spdzProxyList, this.state.spdzApiRoot, this.state.clientId)
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
                      spdzProxyServerList={this.state.spdzProxyList}/>
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
