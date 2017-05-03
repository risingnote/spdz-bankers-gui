/**
 * High level layout for the bankers GUI.
 * Responsible for coordinating SPDZ proxy status change with Connection component.
 */
import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import { Connection } from 'spdz-gui-components'

import BankersContainer from './BankersContainer'

import './BankersGUI.css'

class BankersGUI extends Component {
  constructor (props) {
    super(props)
    this.state = {
      spdzProxyStatus : [] 
    }
    this.updateProxyConnectionStatus = this.updateProxyConnectionStatus.bind(this)    
  }

  /**
   * Update the proxy connection status for each spdz proxy.
   * @param proxyStatus array of objects {id: index of spdzProxyServerList, status: ProxyStatusCodes}
   */
  updateProxyConnectionStatus(proxyStatus) {
    this.setState({spdzProxyStatus: proxyStatus})
  }

  render() {
    return (
      <div className="BankersGUI-main">
        <div className="BankersGUI-container">
            <BankersContainer updateConnectionStatus={this.updateProxyConnectionStatus}
                              spdzProxyServerList={this.props.spdzProxyServerList.toArray().map( immutableMap => immutableMap.toObject())}
                              spdzApiRoot={this.props.spdzApiRoot}
                              clientPublicKey={this.props.clientPublicKey}/>
        </div>
        <div className="BankersGUI-connection">
            <Connection spdzProxyServerList={this.props.spdzProxyServerList} 
                        spdzProxyStatus={this.state.spdzProxyStatus} />
        </div>
      </div>
    )
  }
}

BankersGUI.propTypes = {
  spdzProxyServerList: PropTypes.instanceOf(List).isRequired,
  spdzApiRoot: PropTypes.string.isRequired,
  clientPublicKey: PropTypes.string.isRequired
}

export default BankersGUI
