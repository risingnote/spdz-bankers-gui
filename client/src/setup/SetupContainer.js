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
    // TODO move into an api module, simplify testing, all rest in one place.
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
    const spdzProxyServerList = [
      {
      "key": "1",
      "url": "http://spdzProxy.one:4000",
      "status": "notconnected"
      },
      {
      "key": "2",        
      "url": "http://spdzProxy.two:4000",
      "status": "notconnected"
      }
    ]

    return (
      <div>
        <Setup setupForRun={this.handleSetupClick} spdzProxyServerList={spdzProxyServerList}/>
      </div>
    );
  }
}

export default SetupContainer;
