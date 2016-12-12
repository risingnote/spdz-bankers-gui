/**
 * Responsible for managing data and behaviour for the bankers GUI.
 * Note wrapped in SetupContainer to allow interaction with SPDZ proxies.
 */
import React, { Component } from 'react'

import SetupContainer from '../setup/SetupContainer'

class BankersContainer extends Component {
  constructor () {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div>Contain Gui elements</div>
    )
  }
}

export default SetupContainer(BankersContainer)
