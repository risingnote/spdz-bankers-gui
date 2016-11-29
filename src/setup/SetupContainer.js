/**
 * Responsible for managing data and behaviour for connection setup.
 */
import React, { Component } from 'react';
import Setup from './Setup'

class SetupContainer extends Component {
  constructor () {
    super()
    this.state = {}
    this.handleSetupClick = this.handleSetupClick.bind(this)
  }

  handleSetupClick(e) {
    e.preventDefault();
    console.log('Will run setup.');
  }

  render() {
    return (
      <div>
        <Setup setupForRun={this.handleSetupClick} />
      </div>
    );
  }
}

export default SetupContainer;
