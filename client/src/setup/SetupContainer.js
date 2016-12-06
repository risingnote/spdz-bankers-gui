/**
 * Responsible for managing data and behaviour for connection setup.
 */
import React, { Component } from 'react'
import 'whatwg-fetch'
import { List } from 'immutable'

import { initSpdzServerList, updateSpdzServerStatus } from './SetupContainerHelper' 
import Setup from './Setup'
import { getProxyConfig, connectProxyToEngine } from '../rest_support/SpdzApi'
import ProxyStatusCodes from './ProxyStatusCodes'

class SetupContainer extends Component {
  constructor () {
    super()
    //TODO where should clientid come from ?
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

    //Run setup on all
    const proxyCount = this.state.spdzProxyList.size

      
    //Promise.all these and add then() to gather results and apply to state.
    //Move to SetupContainerHelper and return promise, then to apply to state. 
    // Timer to monitor status ?
    connectProxyToEngine(this.state.spdzProxyList.get(0).get('url'), this.state.spdzApiRoot, this.state.clientId) 
      .then((connectLocation) => {
        console.log('it worked')
        return {id: 0, status: ProxyStatusCodes.Connected}
      }, (ex) => {
        console.log(ex)
        return {id: 0, status: ProxyStatusCodes.Failure}        
      })



    //This is not how you use immutables
    //let proxyListForUpdate = this.state.spdzProxyList
    for (let i=0; i<proxyCount; i++) {
      let status = ProxyStatusCodes.Connected
      if (i===2) {
        status = ProxyStatusCodes.Failure
      }

      const proxyListForUpdate = updateSpdzServerStatus(this.state.spdzProxyList, i, status)
      this.setState({spdzProxyList: proxyListForUpdate}) 
    }
  }

  render() {
    return (
      <Setup setupForRun={this.handleSetupClick} spdzProxyServerList={this.state.spdzProxyList}/>
    );
  }
}

export default SetupContainer;
