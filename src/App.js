import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BigInt from 'big-integer'
import {base64Encode} from './conversions/binary'

class App extends Component {
  constructor() {
    super()
    const bigIntValue = BigInt('452367')
    this.foo = base64Encode(bigIntValue) 
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p> {this.foo} </p>
      </div>
    );
  }
}

export default App;
