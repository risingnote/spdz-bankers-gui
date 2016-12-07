/**
 * Responsible for managing data and behaviour for connection setup.
 */
import React, { Component } from 'react'
import 'whatwg-fetch'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus } from './SetupContainerHelper' 
import Setup from './Setup'
import { getProxyConfig } from '../rest_support/SpdzApi'
import connectToSpdzProxies from '../rest_support/SpdzApiHelper'

class SetupContainer extends Component {
  constructor () {
    super()
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
    e.preventDefault();

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
      <Setup setupForRun={this.handleSetupClick} spdzProxyServerList={this.state.spdzProxyList}/>
    );
  }
}

export default SetupContainer;
