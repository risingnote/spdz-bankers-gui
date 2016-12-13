/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note normally wrapped in SetupContainer to allow interaction with SPDZ proxies.
 */
import React, { Component } from 'react'
import { List } from 'immutable'

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
    // read numinput triples[3] from each spdz proxy, wait until got all of them

    // sum triples over spdz proxies and validate t1 * t2 = t3 for each input

    // for each input, share = input + t1
    
    // send share to each spdz proxy
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
