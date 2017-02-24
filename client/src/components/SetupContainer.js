/**
 * Higher order component to wrap an MPC GUI with setup functions
 * Responsible for getting available proxies and generating client key material.
 */
import React, { Component } from 'react'
import { List, Map } from 'immutable'

import { getProxyConfig, createClientPublicKey, createEncryptionKey } from 'spdz-gui-lib'

function setupWrapper(MPCGui) {
  return class SetupContainer extends Component {
    constructor (props) {
      super(props)
      this.state = {
        clientPublicKey : '',
        spdzApiRoot : "/",
        spdzProxyList : List()
      }
      this.initSpdzServerList = this.initSpdzServerList.bind(this)
    }

    /**
      * Convert a json config into an immutable List structure.
      * Add encryption key to each spdzProxy entry 
      */
    initSpdzServerList(spdzProxyList) {
      return List(
        spdzProxyList.map( (spdzProxy) => {
          return Map(spdzProxy)
            .set("encryptionKey", createEncryptionKey(spdzProxy.publicKey))
          }
        )
      )
    }

    /**
     * At startup get list of SPDZ proxies. Generate client key material.
     */
    componentDidMount() {
      getProxyConfig()
        .then((json) => {
          const spdzProxyList = this.initSpdzServerList(json.spdzProxyList)
          this.setState({spdzApiRoot: json.spdzApiRoot})          
          this.setState({spdzProxyList: spdzProxyList})
          this.setState({clientPublicKey: createClientPublicKey()})
        })
        .catch((ex) => {
          console.log(ex)
        })
    }

    render() {
      return (
        <MPCGui spdzProxyServerList={this.state.spdzProxyList}
                spdzApiRoot={this.state.spdzApiRoot}
                clientPublicKey={this.state.clientPublicKey}/>
      )
    }
  }
}

export default setupWrapper
