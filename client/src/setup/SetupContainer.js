/**
 * Responsible for managing data and behaviour for connection setup.
 */
import React, { Component } from 'react'
import 'whatwg-fetch'
import Setup from './Setup'
import checkStatus from '../rest_support/checkStatus'

class SetupContainer extends Component {
  constructor () {
    super()
    this.state = {
      "spdzApiRoot" : "/",
      "spdzProxyList" : []
    }
    this.handleSetupClick = this.handleSetupClick.bind(this)
  }

  componentDidMount() {
    fetch('/spdzProxyConfig',
      {
        method: 'GET',
        headers: {
          'Accept-Type': 'application/json'
        },
        mode: 'same-origin'
      })
      .then(checkStatus)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        this.setState(json)
      })
      .catch((ex) => {
        console.log('Parsing response from /spdzProxyConfig failed.', ex)
      })
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
