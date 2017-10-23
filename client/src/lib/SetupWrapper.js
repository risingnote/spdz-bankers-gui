/**
 * Higher order component to wrap the Bankers Bonus GUI with a setup function.
 * Responsible for getting SPDZ proxy config and generating client key material.
 */
import React, { Component } from 'react'
import { List, Map } from 'immutable'

import { createClientPublicKey, createEncryptionKey } from 'spdz-gui-lib/dist/crypto'

import { getProxyConfig } from './guiApi'

function setupWrapper(MPCGui, configEndpoint) {
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
      * Add encryption key to each spdzProxy entry.
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
      getProxyConfig(configEndpoint)
        .then((json) => {
          const spdzProxyList = this.initSpdzServerList(json.spdzProxyList)
          this.setState({spdzApiRoot: json.spdzApiRoot})          
          this.setState({spdzProxyList: spdzProxyList})
          // Note createClientPublicKey just gets key created in createEncryptionKey above.
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
                clientPublicKey={this.state.clientPublicKey}
                {...this.props}/>
      )
    }
  }
}

export default setupWrapper
