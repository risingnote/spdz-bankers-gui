/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 */
import React, { Component } from 'react'
import { List } from 'immutable'
import { retrieveShares } from '../rest_support/SpdzApiHelper'
import BankersForm from './BankersForm'

class BankersContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleSubmitBonus = this.handleSubmitBonus.bind(this)
  }

  handleSubmitBonus(bonus) {
    console.log('Do something with the bonus ', bonus)

    retrieveShares(1, true, this.props.spdzProxyServerList, 'apiRoot', 'clientId' )
      .then( (shareList) => {
        //return input + share (gfp addition)
      })
      .then( (inputList) => {
        // send share to each spdz proxy
      })
      .catch((ex) => {
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
  spdzProxyServerList: React.PropTypes.instanceOf(List).isRequired
}

export default BankersContainer
