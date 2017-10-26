/**
 * High level layout for the bankers GUI.
 * Responsible for coordinating SPDZ proxy status change with Connection component.
 */
import React, { PropTypes, Component } from 'react'
import { List } from 'immutable'
import Connection from '../components/Connection'

import BankersFormContainer from '../components/BankersFormContainer'
import BankersTable from '../components/BankersTable'

import './BankersGUI.css'

class BankersGUI extends Component {
  constructor (props) {
    super(props)
    this.state = {
      spdzProxyStatus : [],
      dinersList: [],
      winningClientId: undefined
    }
    this.updateProxyConnectionStatus = this.updateProxyConnectionStatus.bind(this)
    this.changeToDiners = this.changeToDiners.bind(this)  
  }

  /**
   * Update the proxy connection status for each spdz proxy.
   * @param proxyStatus array of objects {id: index of spdzProxyServerList, status: ProxyStatusCodes}
   */
  updateProxyConnectionStatus(proxyStatus) {
    this.setState({spdzProxyStatus: proxyStatus})
  }

  changeToDiners(dinersList, winningClientId) {
    this.setState({dinersList: dinersList, winningClientId: winningClientId})
  }

  render() {
    const connectionHeaderStyle = {
        color: 'rgb(28, 118, 152)',
        fontWeight: 'bold'
    }    
    return (
      <div className="BankersGUI-main">
        <div className="BankersGUI-component">
          <BankersFormContainer className="BankersGUI-component"
                                updateConnectionStatus={this.updateProxyConnectionStatus}
                                changeToDiners={this.changeToDiners}
                                spdzProxyServerList={this.props.spdzProxyServerList.toArray().map(immutableMap => immutableMap.toObject())}
                                spdzApiRoot={this.props.spdzApiRoot}
                                clientPublicKey={this.props.clientPublicKey} />
        </div>
        <div className="BankersGUI-component">
          <BankersTable className="BankersGUI-component"
                        diners={this.state.dinersList}
                        winningClientId={this.state.winningClientId} />
        </div>
        <div className="BankersGUI-component">
          <Connection className="BankersGUI-component"
                      spdzProxyServerList={this.props.spdzProxyServerList}
                      spdzProxyStatus={this.state.spdzProxyStatus}
                      headerStyle={connectionHeaderStyle} />
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
