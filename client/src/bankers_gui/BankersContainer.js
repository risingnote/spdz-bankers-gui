/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 */
import React, { Component } from 'react'
import { List } from 'immutable'
import { sendInputsWithShares } from '../rest_support/SpdzApiHelper'
import BankersForm from './BankersForm'
import Gfp from '../math/Gfp'

class BankersContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleSubmitBonus = this.handleSubmitBonus.bind(this)
  }

  handleSubmitBonus(bonus) {
    sendInputsWithShares([bonus], true, this.props.spdzProxyServerList, this.props.spdzApiRoot, this.props.clientPublicKey )
      .then( () => {
        //TODO create a status message for display 
        console.log('Input sent.')
      })
      .catch((ex) => {
        //TODO create a status message for display (submit failed, see console logs for more information)
        console.log(ex)
      })
  }

  render() {
    const proxyStatusMessage = (this.props.allProxiesConnected ? 'all connected' : 'not all connected')
    return (
      <div>
        <BankersForm submitBonus={this.handleSubmitBonus} enableSubmit={this.props.allProxiesConnected} />
        <p>Proxies {proxyStatusMessage}</p>
      </div>
    )
  }
}

BankersContainer.propTypes = {
  allProxiesConnected: React.PropTypes.bool.isRequired,
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired,
  spdzApiRoot: React.PropTypes.string.isRequired,
  clientPublicKey: React.PropTypes.string.isRequired
}

export default BankersContainer
