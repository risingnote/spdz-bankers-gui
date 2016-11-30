import React, { Component } from 'react'
import logo from './logo.png'
import './App.css'
import SetupContainer from './setup/SetupContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>SPDZ Demonstrators</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <SetupContainer />
      </div>
    )
  }
}

export default App;
