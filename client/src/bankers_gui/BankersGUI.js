/**
 * High level layout for the bankers GUI.
 * Responsible for coordinating SPDZ proxy status change with Connection component.
 */
import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'

import BankersContainer from './BankersContainer'
import Connection from '../connection/Connection'
import { generateProxyStatusList } from '../connection/ProxyStatusHelper'

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
    // Calculate proxyStatus at render time becuase 2 parts arrive at different times.
    const proxyStatusForDisplay = generateProxyStatusList(this.props.spdzProxyServerList, this.state.spdzProxyStatus)
    return (
      <div className="BankersGUI-main">
        <div className="BankersGUI-container">
            <BankersContainer updateConnectionStatus={this.updateProxyConnectionStatus}
                              spdzProxyServerList={this.props.spdzProxyServerList}
                              spdzApiRoot={this.props.spdzApiRoot}
                              clientPublicKey={this.props.clientPublicKey}/>
        </div>
        <div className="BankersGUI-connection">
            <Connection proxyStatusForDisplay={proxyStatusForDisplay}/>
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
